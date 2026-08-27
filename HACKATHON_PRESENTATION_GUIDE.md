# 🏆 CineAI — Official Hackathon Presentation & Project Walkthrough Guide

> **Project Name:** CineAI (AI Movie Ticket Booking Assistant)  
> **Repository:** [https://github.com/vishaltvgithub/ai-movie-ticket-booking](https://github.com/vishaltvgithub/ai-movie-ticket-booking)  
> **Live Deployed App:** [https://ai-movie-ticket-booking-4.onrender.com](https://ai-movie-ticket-booking-4.onrender.com)  

---

## 🎯 1. The 30-Second Elevator Pitch

> *"Traditional movie booking apps are just static catalogs where users spend minutes filtering showtimes, reading reviews, and guessing the best seats. **CineAI** transforms movie discovery into an intelligent, conversational experience. Users can say things like **'Suggest a Tamil action movie tonight for a date'**, get instant smart recommendations with live showtimes, and automatically reserve acoustically and visually optimal seats with **zero double-booking risk** and instant digital QR passes."*

---

## 📌 2. Problem Statement vs. Our Solution

| Problem with Current Systems | How CineAI Solves It |
| :--- | :--- |
| **Search Fatigue**: Scrolling through hundreds of movie posters without finding what matches your mood. | **Conversational CineAI**: Extracts genres, language, time preferences, and ratings via natural language. |
| **Suboptimal Seating**: Users don't know which seats have the best viewing angles and sound acoustics. | **AI Seat Optimization**: Algorithmic engine that automatically scores and highlights center-row contiguous seats. |
| **Double Booking Conflicts**: High-traffic flash sales often lead to concurrency bugs and failed bookings. | **Transactional Concurrency Guard**: Atomic database transaction with duplicate-seat collision prevention. |
| **Scattered Multiplex Info**: Hard to compare showtimes across PVR, INOX, AGS, SPI, and Cinepolis. | **Unified Showtime Matrix**: Unified date-strip and theatre aggregation with one-click seat layout inspection. |

---

## 🏗️ 3. End-to-End System Architecture

```
┌────────────────────────────────────────────────────────┐
│              User Interface (React 19 + Vite)          │
│  • Cinema Dark & Glassmorphism Theme (Outfit Fonts)    │
│  • Live Dashboard Stats & Multi-Filter Catalog         │
│  • Floating CineAI Conversational Widget               │
│  • Curved Cinema Screen & Interactive Seating Matrix   │
│  • Instant QR E-Ticket Generator with Confetti Pass    │
└───────────────────────────┬────────────────────────────┘
                            │ Axios HTTP / REST API (JWT Authenticated)
                            ▼
┌────────────────────────────────────────────────────────┐
│             FastAPI Backend (Python 3.11 ASGI)         │
│  • Routers: /api/auth, /movies, /theatres, /shows,     │
│             /seats, /bookings, /ai/chat, /health       │
│  • Middlewares: CORS, Timing, JWT Token Verification   │
│  • Validation: Pydantic v2 Request/Response Schemas   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────┐ ┌────────────────────────────────┐
│   CineAI Intelligence Engine │ │  Database Layer (SQLAlchemy 2) │
│  • Semantic NLP Entity Parser│ │  • SQLite (Zero-config local)  │
│  • Groq Cloud LLM Integration│ │  • MySQL / PostgreSQL (Cloud)  │
│  • Acoustic Seat Ranker Algo │ │  • Atomic Transaction Locks    │
└──────────────────────────────┘ └────────────────────────────────┘
```

---

## 🛠️ 4. What We Built Step-by-Step (Technical Deep Dive)

### Step 1: Database & Data Modeling (`database/`, `backend/models.py`)
- Built an enterprise relational database with 8 core entities:
  1. `users`: Salted SHA-256 hashed password authentication with JWT sessions.
  2. `movies`: Title, genre, language, duration, ratings (8.0+ ⭐), release date, director, cast.
  3. `theatres`: Multiplex chains (PVR, INOX, AGS, SPI Sathyam, Cinepolis).
  4. `screens`: IMAX 4K, Dolby Atmos, Laser 3D, and Acoustic Luxe.
  5. `shows`: Multi-slot daily schedules (10:30 AM, 1:45 PM, 4:30 PM, 7:15 PM, 10:30 PM).
  6. `seats`: Tiered pricing matrix — Regular (₹150), Premium (₹220), VIP (₹300).
  7. `bookings`: Unique verifiable reference code (`UPS-MOV-XXXXXX`), timestamps, status.
  8. `booking_seats`: Junction table enforcing database-level uniqueness on reserved seats.

### Step 2: High-Performance FastAPI Backend (`backend/routers/`, `backend/services/`)
- **Async API Endpoints**:
  - `POST /api/ai/chat`: Processes natural language inquiries and returns formatted recommendation cards.
  - `GET /api/shows/{id}/seats`: Fetches real-time seat availability map.
  - `GET /api/shows/{id}/recommended-seats?count=N`: Analyzes line-of-sight and returns best seats.
  - `POST /api/bookings`: Atomically locks seats and creates confirmed booking pass.
  - `GET /api/users/{id}/bookings`: Returns user's active and historical tickets.
  - `GET /api/stats`: Real-time counter of movies, theatres, and bookings.
  - `GET /health`: Zero-dependency health check endpoint.

### Step 3: CineAI & Recommendation Algorithms (`backend/services/`)
- **Hybrid Intelligence Architecture**:
  - **Level 1 (Semantic NLP Parsing)**: Extracts structured intent (e.g. `is_family`, `genre: Action`, `language: Tamil`, `time: tonight`, `min_rating: 8.0`) without requiring an external API key.
  - **Level 2 (Groq LLM Enrichment)**: When `GROQ_API_KEY` is provided, generates dynamic cinema concierge commentary.
  - **Center-Acoustic Seat Scoring Algorithm**: Calculates the Euclidian distance of each available seat from the screen's acoustic center (Row C & D, Columns 4 & 5) and finds contiguous block availability.

### Step 4: Double-Booking Prevention & Concurrency (`booking_service.py`)
- Prevents race conditions when two users click the same seat simultaneously:
  - Validates seat availability inside an isolated transaction.
  - Returns `HTTP 409 Conflict` with clear explanation if a seat was claimed by another session.

### Step 5: Modern Glassmorphic Frontend (`frontend/src/`)
- Built with **React 19 + Vite**:
  - **`AIChatbot.jsx`**: Floating interactive widget with Quick Suggestion chips and direct *"Book Now"* buttons.
  - **`SeatMap.jsx`**: Visual theater layout with illuminated curved screen indicator.
  - **`BookingConfirmation.jsx`**: Digital pass with barcode, QR verification, and canvas-confetti celebration.
  - **`AuthContext.jsx` & `ToastContext.jsx`**: Global authentication state and non-intrusive toast notifications.

---

## 🎬 5. Judge Presentation & Live Demo Script (2 Minutes)

Follow this structured script during your demo for maximum impact:

```
[0:00 - 0:25] THE HOOK & PROBLEM
"Good morning/afternoon judges! Finding the right movie and securing good seats is often 
frustrating across multiple apps. We built CineAI — an intelligent cinema booking assistant 
that finds movies using conversational AI, recommends optimal viewing seats, and issues instant tickets."

[0:25 - 0:50] CINEAI IN ACTION (Live Interaction)
"Let's see CineAI in action. I'll click the floating CineAI assistant and ask:
 'I want to watch a top-rated Tamil action movie tonight.'
Notice how CineAI extracts my mood, language, and genre preferences, and suggests 
'Leo: Blood & Thunder' (8.6⭐) and 'Jailer' (8.4⭐) right inside the chat with direct booking links."

[0:50 - 1:15] MULTIPLEX & AI SEAT RECOMMENDATION
"I'll click 'Book Now' on Leo. We see showtimes across PVR, INOX, and SPI Cinemas.
Let's choose PVR Cinemas at 07:15 PM.
In the seat map, rather than guessing where to sit, I click 'Suggest Best Seats'.
CineAI analyzes screen acoustics and viewing angles, and automatically selects 
Row C center seats C4 and C5 with an explanation banner."

[1:15 - 1:40] TRANSACTION INTEGRITY & CHECKOUT
"Let's proceed to payment. We support UPI QR, Cards, and Net Banking.
Upon clicking Pay, our backend executes an atomic transaction with a double-booking guard 
to ensure these seats cannot be stolen by another user.
Instantly, we get our confirmed Digital E-Ticket with QR code and unique reference UPS-MOV-XXXXXX."

[1:40 - 2:00] ARCHITECTURE & WRAP-UP
"Under the hood, CineAI is powered by React 19, FastAPI, Groq LLM, and SQLAlchemy.
All 10 integration tests pass, and the app is live right now on Render. Thank you!"
```

---

## ❓ 6. Top Judge Questions & Winning Answers

### Q1: "What happens if the Groq AI API goes down or is slow?"
> **Answer:** *"We engineered CineAI with a **hybrid fallback architecture**. If the LLM API is unreachable or takes >8 seconds, our built-in regex-based semantic entity parser immediately handles the query, extracts preferences, and returns accurate database recommendations with zero downtime."*

### Q2: "How do you prevent two users from booking the same seat at the same time?"
> **Answer:** *"We enforce double-booking prevention at the database and service layer (`booking_service.py`). When a booking request arrives, we verify all seat IDs against existing confirmed bookings within an atomic transaction. If any seat is already taken, it aborts and returns an `HTTP 409 Conflict` error."*

### Q3: "How does the 'Suggest Best Seats' algorithm work?"
> **Answer:** *"The algorithm evaluates seats based on two cinema science factors: **viewing angle** (perpendicularity to the screen center) and **acoustic sweet-spot** (center middle rows). It calculates distance from the optimal focal point (Rows C/D, Seats 4/5) and finds the closest contiguous block of available seats."*

### Q4: "How is user authentication secured?"
> **Answer:** *"We use salted SHA-256 password hashing and sign authentication sessions using signed JWT (JSON Web Tokens) with expiration timers, validated by FastAPI dependency injection on protected endpoints."*

---

## 📊 7. Automated Test Suite Verification

Run the integration suite to demonstrate reliability:
```bash
cd backend
python test_api.py
```
- ✅ **Test 1**: Health & Root API Check
- ✅ **Test 2**: Dashboard Live Statistics
- ✅ **Test 3**: Movies Catalog Retrieval (12+ movies)
- ✅ **Test 4**: Multi-Filter Movie Search (Tamil + Action)
- ✅ **Test 5**: CineAI Natural Language Intent Recognition
- ✅ **Test 6**: Dynamic Seating Matrix Layout
- ✅ **Test 7**: AI Center Seat Recommendation Engine
- ✅ **Test 8**: Booking Creation & Digital Pass Issuance
- ✅ **Test 9**: Double-Booking Race Condition Guard (409 Conflict)
- ✅ **Test 10**: User Booking History Retrieval
