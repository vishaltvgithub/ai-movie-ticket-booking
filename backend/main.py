import logging
from datetime import date
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
from schemas import DashboardStats
from routers import auth, movies, theatres, shows, seats, bookings, ai
from init_db import seed_initial_data_if_empty

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables if not present
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
    # Seed data if tables are empty
    seed_initial_data_if_empty()
except Exception as e:
    logger.error(f"Database initialization error: {e}")

app = FastAPI(
    title="AI Movie Ticket Booking Assistant API",
    description="FastAPI Backend for UPS Hackathon AI Cinema Booking Application",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(theatres.router)
app.include_router(shows.router)
app.include_router(seats.router)
app.include_router(bookings.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "AI Movie Ticket Booking Assistant",
        "docs_url": "/docs",
        "api_prefix": "/api"
    }

@app.get("/api/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    movies_count = db.query(models.Movie).count()
    theatres_count = db.query(models.Theatre).count()
    today = date.today()
    shows_today = db.query(models.Show).filter(models.Show.show_date == today).count()
    if shows_today == 0:
        shows_today = db.query(models.Show).count() # fallback to all active shows
    bookings_count = db.query(models.Booking).count()

    return DashboardStats(
        movies_count=movies_count,
        theatres_count=theatres_count,
        shows_today_count=shows_today,
        bookings_count=bookings_count
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
