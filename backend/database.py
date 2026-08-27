import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./movie_booking_db.sqlite")

engine = None
SessionLocal = None
Base = declarative_base()

try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        logger.info("Using SQLite database.")
    else:
        # MySQL or other connection
        engine = create_engine(
            DATABASE_URL,
            pool_recycle=3600,
            pool_pre_ping=True
        )
        with engine.connect() as conn:
            logger.info("Connected successfully to database.")
except Exception as e:
    logger.warning(f"Database connection failed ({e}). Falling back to local SQLite database.")
    SQLITE_URL = "sqlite:///./movie_booking_db.sqlite"
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    logger.info(f"Using SQLite database at {SQLITE_URL}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
