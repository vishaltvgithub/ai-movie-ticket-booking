import os
import re
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from models import Movie, Show, Theatre
import httpx

logger = logging.getLogger(__name__)

# Keyword mappings for rule-based Natural Language Processing
GENRE_KEYWORDS = {
    "action": "Action",
    "fight": "Action",
    "stunt": "Action",
    "blockbuster": "Action",
    "funny": "Comedy",
    "comedy": "Comedy",
    "humor": "Comedy",
    "laugh": "Comedy",
    "hilarious": "Comedy",
    "romantic": "Romance",
    "romance": "Romance",
    "love": "Romance",
    "date": "Romance",
    "couple": "Romance",
    "scary": "Horror",
    "horror": "Horror",
    "ghost": "Horror",
    "spooky": "Horror",
    "thriller": "Thriller",
    "suspense": "Thriller",
    "mystery": "Thriller",
    "crime": "Thriller",
    "sci-fi": "Sci-Fi",
    "scifi": "Sci-Fi",
    "space": "Sci-Fi",
    "science fiction": "Sci-Fi",
    "future": "Sci-Fi",
    "family": "Comedy", # or Family
    "kids": "Comedy",
    "children": "Comedy",
}

LANGUAGE_KEYWORDS = {
    "tamil": "Tamil",
    "kollywood": "Tamil",
    "hindi": "Hindi",
    "bollywood": "Hindi",
    "english": "English",
    "hollywood": "English",
}

TIME_KEYWORDS = {
    "tonight": "evening",
    "night": "night",
    "evening": "evening",
    "afternoon": "afternoon",
    "morning": "morning",
    "today": "today",
}

def extract_preferences_from_text(query: str) -> Dict[str, Any]:
    text = query.lower()
    prefs: Dict[str, Any] = {
        "genres": [],
        "language": None,
        "min_rating": None,
        "max_duration": None,
        "time_pref": None,
        "is_family": False,
        "is_date": False,
        "is_seat_query": False,
        "is_show_query": False,
    }

    # Detect genre keywords
    for word, genre in GENRE_KEYWORDS.items():
        if re.search(r'\b' + re.escape(word) + r'\b', text):
            if genre not in prefs["genres"]:
                prefs["genres"].append(genre)

    # Detect language keywords
    for word, lang in LANGUAGE_KEYWORDS.items():
        if re.search(r'\b' + re.escape(word) + r'\b', text):
            prefs["language"] = lang
            break

    # Detect family / date mood
    if "family" in text or "kids" in text:
        prefs["is_family"] = True
    if "date" in text or "partner" in text or "girlfriend" in text or "boyfriend" in text:
        prefs["is_date"] = True

    # Detect time preferences
    for word, t_pref in TIME_KEYWORDS.items():
        if word in text:
            prefs["time_pref"] = t_pref
            break

    # Detect ratings (e.g., "above 8", "rated > 8.5", "rating 8+")
    rating_match = re.search(r'(?:above|rated|rating|min|>|\+)\s*([789](?:\.\d)?)', text)
    if rating_match:
        try:
            prefs["min_rating"] = float(rating_match.group(1))
        except ValueError:
            pass

    # Detect duration (e.g., "under 2 hours", "less than 150 mins")
    duration_hour_match = re.search(r'(?:under|less than|within)\s*(\d+(?:\.\d+)?)\s*(?:hour|hr|hours)', text)
    if duration_hour_match:
        try:
            prefs["max_duration"] = int(float(duration_hour_match.group(1)) * 60)
        except ValueError:
            pass
    
    duration_min_match = re.search(r'(?:under|less than|within)\s*(\d+)\s*(?:min|mins|minutes)', text)
    if duration_min_match:
        try:
            prefs["max_duration"] = int(duration_min_match.group(1))
        except ValueError:
            pass

    # Seat query detection
    if any(w in text for w in ["seat", "seats", "best seat", "where to sit", "row", "middle seat"]):
        prefs["is_seat_query"] = True

    # Show timing query detection
    if any(w in text for w in ["show", "timing", "theatre", "theater", "cinema", "when"]):
        prefs["is_show_query"] = True

    return prefs

async def ask_llm_if_available(system_prompt: str, user_prompt: str) -> Optional[str]:
    api_key = os.getenv("GROQ_API_KEY", "").strip() or os.getenv("LLM_API_KEY", "").strip()
    if not api_key:
        return None

    groq_model = os.getenv("GROQ_MODEL", "groq/compound-mini").strip() or "groq/compound-mini"
    groq_api_url = "https://api.groq.com/openai/v1/chat/completions"

    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": groq_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 300,
            "temperature": 0.7
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(groq_api_url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                if "choices" in data and len(data["choices"]) > 0:
                    return data["choices"][0]["message"]["content"].strip()
            else:
                logger.warning(f"Groq API returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.warning(f"Groq API request error: {e}. Falling back to rule-based generation.")
    return None

async def process_chat_message(db: Session, message: str, current_movie_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Processes natural language chat query and returns:
    - reply (string)
    - recommendations (list of Movie models)
    - quick_suggestions (list of sample prompts)
    - extracted_preferences (dict)
    """
    prefs = extract_preferences_from_text(message)
    
    # 1. Handle Seat Specific queries
    if prefs["is_seat_query"]:
        reply = (
            "💺 For the best cinematic experience, I recommend selecting middle rows (Row C or D) "
            "and center seats (4 and 5) for optimal audio acoustics and panoramic line-of-sight. "
            "You can also use our **'Suggest Best Seats'** button directly on the seat selection page!"
        )
        return {
            "reply": reply,
            "extracted_preferences": prefs,
            "recommendations": [],
            "quick_suggestions": ["Recommend a movie", "Tamil action movie", "Family movie tonight", "Show evening shows"]
        }

    # 2. Build Query Filters for Movies
    query = db.query(Movie)

    if prefs["language"]:
        query = query.filter(Movie.language.ilike(f"%{prefs['language']}%"))

    if prefs["genres"]:
        genre_filters = [Movie.genre.ilike(f"%{g}%") for g in prefs["genres"]]
        query = query.filter(or_(*genre_filters))

    if prefs["min_rating"]:
        query = query.filter(Movie.rating >= prefs["min_rating"])

    if prefs["max_duration"]:
        query = query.filter(Movie.duration <= prefs["max_duration"])

    matching_movies = query.order_by(Movie.rating.desc()).limit(4).all()

    # If no strict match, fallback to top-rated or trending
    if not matching_movies:
        if prefs["language"]:
            matching_movies = db.query(Movie).filter(Movie.language.ilike(f"%{prefs['language']}%")).order_by(Movie.rating.desc()).limit(3).all()
        else:
            matching_movies = db.query(Movie).order_by(Movie.rating.desc()).limit(3).all()

    # 3. Generate response text
    reply = ""
    # Try Groq LLM if configured
    if os.getenv("GROQ_API_KEY") or os.getenv("LLM_API_KEY"):
        movie_context = ", ".join([f"{m.title} ({m.genre}, {m.language}, rating: {m.rating})" for m in matching_movies])
        system_prompt = (
            "You are CineAI, an enthusiastic and helpful cinema concierge for the AI Movie Ticket Booking app. "
            "Keep your reply under 3 sentences. Direct the user to the recommended movies provided."
        )
        user_prompt = f"User asked: '{message}'. Extracted preferences: {prefs}. Matching available movies: [{movie_context}]."
        llm_reply = await ask_llm_if_available(system_prompt, user_prompt)
        if llm_reply:
            reply = llm_reply

    # Fallback to rich template generation
    if not reply:
        if "tamil" in message.lower() and "action" in message.lower():
            reply = (
                "Here are the top Tamil action blockbusters currently playing! "
                f"I highly recommend **{matching_movies[0].title}** for its adrenaline-packed thrill and stellar audience ratings."
            )
        elif prefs["is_family"] or "funny" in message.lower():
            family_movie = next((m for m in matching_movies if "Comedy" in m.genre or "Star" in m.title), matching_movies[0])
            reply = (
                f"Based on your preference for a lighthearted experience with family, I recommend **{family_movie.title}**! "
                "It's packed with clean humor, heartfelt moments, and great entertainment."
            )
        elif prefs["is_date"] or "romance" in message.lower():
            reply = (
                f"For a fantastic movie date, check out **{matching_movies[0].title}**! "
                "It has a captivating storyline and outstanding music."
            )
        elif prefs["min_rating"]:
            reply = f"Here are critically acclaimed movies rated above {prefs['min_rating']}⭐ that you'll love:"
        elif prefs["language"]:
            reply = f"I found these popular {prefs['language']} movies currently screening in theatres near you:"
        elif prefs["genres"]:
            genres_str = ", ".join(prefs["genres"])
            reply = f"Here are the top-rated {genres_str} movies matching what you're looking for:"
        else:
            reply = (
                "Here are the trending movies audiences are raving about today! "
                "Click on any movie to view showtimes, choose your theatre, or pick seats."
            )

    quick_suggestions = [
        "Tamil action movie tonight",
        "Funny family movie",
        "Top rated movies > 8",
        "Suggest best seats",
        "Romantic comedy for date"
    ]

    return {
        "reply": reply,
        "extracted_preferences": prefs,
        "recommendations": matching_movies,
        "quick_suggestions": quick_suggestions
    }
