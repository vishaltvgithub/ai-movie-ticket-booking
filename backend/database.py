import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default to SQLite for zero-config local runs, with seamless Railway PostgreSQL/MySQL support
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./movie_booking_db.sqlite")

# Handle Railway/Heroku postgres:// -> postgresql:// dialect naming
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = None
SessionLocal = None
Base = declarative_base()

try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        logger.info(f"Connected successfully to SQLite database.")
    elif DATABASE_URL.startswith("postgresql"):
        engine = create_engine(
            DATABASE_URL,
            pool_recycle=3600,
            pool_pre_ping=True
        )
        with engine.connect() as conn:
            logger.info("Connected successfully to PostgreSQL Database.")
    else:
        # MySQL or other relational connection
        if not DATABASE_URL.startswith("mysql+pymysql") and DATABASE_URL.startswith("mysql://"):
            DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)
        engine = create_engine(
            DATABASE_URL,
            pool_recycle=3600,
            pool_pre_ping=True
        )
        with engine.connect() as conn:
            logger.info("Connected successfully to MySQL Database.")
except Exception as e:
    logger.warning(f"Primary database connection failed ({e}). Falling back to local SQLite database.")
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
