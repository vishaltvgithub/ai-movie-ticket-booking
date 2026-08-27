# 🎬 CineAI — AI Movie Ticket Booking Assistant
> **Full-Stack AI Cinema Discovery & Ticket Booking Platform**  
> An intelligent, end-to-end movie ticket booking platform featuring natural language movie recommendations, AI-powered acoustic & viewing angle seat suggestions, real-time showtime scheduling, and zero double-booking transactional guarantees.

---

### 🌐 Live Demo & Deployment

| Resource | Link |
|---|---|
| **🚀 Live Application (Render)** | **[https://ai-movie-ticket-booking-4.onrender.com](https://ai-movie-ticket-booking-4.onrender.com)** |
| **🐙 GitHub Repository** | **[https://github.com/vishaltvgithub/ai-movie-ticket-booking](https://github.com/vishaltvgithub/ai-movie-ticket-booking)** |

---

## 📌 Features Overview

- **🏠 Cinematic Landing Page**: Dynamic hero search, real-time dashboard metric counters, categorized movie grids (Now Showing, Trending, AI Curated).
- **🔍 Multi-Criteria Search & Filter**: Live keyword search across title, director, actors, genre (Action, Comedy, Romance, Thriller, Sci-Fi, Horror), language (Tamil, Hindi, English), and ratings (8.0+ ⭐).
- **✨ CineAI Floating Chatbot**:
  - Semantic natural language processing for intent & mood recognition.
  - Generates interactive movie cards inside chat bubbles with instant *"Book Now"* actions.
  - Hybrid intelligence: Works 100% offline with rule-based NLP + optional Groq LLM integration.
- **🎦 Theatre & Showtime Selection**: Date strip picker (Today, Tomorrow, Upcoming) with multiplex cards and showtime badges (PVR, INOX, AGS, SPI, Cinepolis).
- **💺 Interactive Cinema Seat Matrix**:
  - Tiers: Regular (₹150), Premium (₹220), VIP (₹300).
  - Curved illuminated cinema screen indicator.
  - Live seat status (Available, Selected, Booked, AI Recommended).
- **🧠 "Suggest Best Seats" AI Engine**: Automatically highlights and auto-selects optimal middle-row, center-aligned seats with an explanation banner.
- **💳 Simulated Checkout & Mock Payment**: UPI (with QR code scanner simulation), Credit/Debit Card, Net Banking, and Wallets.
- **🎟️ E-Ticket Confirmation & PDF Print**: Professional cinema pass with unique booking ID, QR code, theatre details, and confetti celebration animation.
- **📑 My Bookings Management**: View all active passes or cancel reservations.
- **🔐 JWT Authentication**: Secure user registration and login with salted password hashing.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast component rendering, Lucide Icons, Axios client, React Router v7 |
| **Styling** | Vanilla CSS3 | Custom Cinema Dark Theme, Glassmorphism, Google Fonts (`Outfit` & `Plus Jakarta Sans`) |
| **Backend** | Python 3.10+ / FastAPI | High-performance ASGI framework, Uvicorn, Pydantic v2, python-jose (JWT) |
| **Database & ORM** | SQLite / MySQL / PostgreSQL + SQLAlchemy 2 | Zero-config local SQLite + MySQL/PostgreSQL production support |
| **AI / LLM** | Groq Cloud LLM + NLP | Fast inference using `groq/compound-mini` or rule-based semantic NLP fallback |

---

## 🏗️ Architecture Diagram

```
User (Browser / Mobile)
   │
   ▼
React + Vite Frontend (Cinema Dark Theme & Glassmorphic UI)
   │  (Axios REST API Calls / JWT Token Auth / Toast Alerts / CineAI Chatbot)
   ▼
FastAPI Backend (Uvicorn / Pydantic / SQLAlchemy / CORS Enabled)
   ├── Routers: auth, movies, theatres, shows, seats, bookings, ai
   └── Services: ai_service, recommendation_service, booking_service
   │
   ▼
Database (SQLite default for zero-config local runs, or MySQL / PostgreSQL)
```

---

## 📂 Project Structure

```
ai-travel-assistent/
├── database/
│   ├── schema.sql                 # MySQL DDL for tables, constraints & indexes
│   └── seed.sql                   # Initial cinema dataset (movies, theatres, shows)
├── backend/
│   ├── main.py                    # FastAPI application factory, CORS & /health API
│   ├── database.py                # SQLAlchemy engine & session lifecycle (SQLite/MySQL)
│   ├── models.py                  # Declarative ORM models
│   ├── schemas.py                 # Pydantic request/response validation schemas
│   ├── init_db.py                 # Auto-seeding script on startup
│   ├── test_api.py                # End-to-end integration test suite (10 automated tests)
│   ├── requirements.txt           # Python package dependencies
│   ├── .env.example               # Backend environment variables template
│   ├── routers/
│   │   ├── auth.py                # Registration, Login, JWT tokens
│   │   ├── movies.py              # Search, filter, recommended movies
│   │   ├── theatres.py            # Multiplex queries
│   │   ├── shows.py               # Showtimes by movie & date
│   │   ├── seats.py               # Seat layout & AI seat suggestions
│   │   ├── bookings.py            # Create booking, view pass, user history
│   │   └── ai.py                  # POST /api/ai/chat CineAI endpoint
│   └── services/
│       ├── ai_service.py          # NLP intent extraction & conversational logic
│       ├── recommendation_service.py # Seat ranking & center view algorithm
│       └── booking_service.py     # Double-booking guard & code generator
├── frontend/
│   ├── index.html                 # Main HTML with cinema metadata
│   ├── vite.config.js             # Vite bundler config
│   ├── package.json               # Frontend dependencies & scripts
│   ├── .env.example               # Frontend environment variables template
│   └── src/
│       ├── main.jsx               # React DOM root with Context providers
│       ├── App.jsx                # Route declarations & floating CineAI trigger
│       ├── index.css              # Cinema dark glassmorphic stylesheet
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth state & user storage
│       │   └── ToastContext.jsx   # Toast notifications provider
│       ├── services/
│       │   └── api.js             # Centralized Axios API client
│       ├── components/
│       │   ├── Navbar.jsx         # Sticky glass navigation bar
│       │   ├── Hero.jsx           # Search hero with Ask AI CTA
│       │   ├── MovieCard.jsx      # Glossy poster card with badges
│       │   ├── MovieGrid.jsx      # Responsive categorized sections
│       │   ├── FilterBar.jsx      # Genre, language, rating pill filters
│       │   ├── TheatreCard.jsx    # Multiplex info with showtime pills
│       │   ├── ShowTimeSelector.jsx # Date strip picker
│       │   ├── SeatMap.jsx        # Curved screen & interactive seat matrix
│       │   ├── BookingSummary.jsx # Pricing breakdown sidebar
│       │   ├── AIChatbot.jsx      # Flagship floating CineAI widget
│       │   ├── Footer.jsx         # Cinema credits & architecture info
│       │   └── LoadingSpinner.jsx # Animated cinema loader
│       └── pages/
│           ├── Home.jsx           # Landing view with live dashboard stats
│           ├── Movies.jsx         # Search catalog with live filtering
│           ├── MovieDetails.jsx   # Backdrop hero, synopsis, showtimes
│           ├── SeatSelection.jsx  # Interactive seat picker & AI suggestions
│           ├── Checkout.jsx       # Booking verification & contact info
│           ├── Payment.jsx        # Mock UPI / Card payment gateway
│           ├── BookingConfirmation.jsx # E-ticket pass with QR & print
│           ├── MyBookings.jsx     # User tickets & reservation history
│           ├── Login.jsx          # User sign in
│           └── Register.jsx       # User sign up
├── .env.example                   # Root environment configuration template
├── .gitignore                     # Git ignore rules for secrets and build files
└── README.md
```

---

## ⚡ Getting Started (Local Development)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1️⃣ Backend Setup (FastAPI)

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### 2️⃣ Frontend Setup (React + Vite)

Open a **second terminal**:
```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

### 3️⃣ Running Automated Tests

Run the end-to-end integration test suite:
```powershell
cd backend
python test_api.py
```
**Tests verified:**
1. Health & Root endpoints
2. Dashboard metrics retrieval
3. Movies catalog and multi-criteria search
4. CineAI natural language chat & recommendations
5. Theatre seating map generation
6. AI Center Seat recommendation algorithm
7. Booking creation and ticket code issuance
8. Double-booking conflict guard (HTTP 409)
9. User booking history retrieval

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the `backend` folder:

```env
# Database (defaults to SQLite if unset)
DATABASE_URL=sqlite:///./movie_booking_db.sqlite

# Security & JWT
SECRET_KEY=cine_secret_jwt_key_2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Integration (Groq Cloud LLM)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=groq/compound-mini

# Server & CORS
PORT=8000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173
```

---

## 🔒 Security & Concurrency Design
- **Zero Double-Booking Guarantee**: Implemented via database transactional locking in `backend/services/booking_service.py` to prevent race conditions when two users select the same seat simultaneously.
- **Salted Password Hashing**: Passwords stored using SHA-256 salted hashing with signed JWT access tokens.
- **CORS Protection**: Whitelists frontend client origins with configurable environment variables.
- **Safe Fallbacks**: Works 100% offline with zero dependencies on third-party APIs, and seamlessly elevates to Groq LLM when configured.

---

## 📄 License
This project is licensed under the MIT License.
