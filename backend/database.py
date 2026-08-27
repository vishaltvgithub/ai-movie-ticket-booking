import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_database_url() -> str:
    # 1. Direct DATABASE_URL or MYSQL_URL or POSTGRES_URL
    db_url = os.getenv("DATABASE_URL") or os.getenv("MYSQL_URL") or os.getenv("POSTGRES_URL")
    
    # 2. Support discrete DB connection variables (common on Railway MySQL/PostgreSQL)
    if not db_url:
        host = os.getenv("DB_HOST") or os.getenv("MYSQLHOST")
        user = os.getenv("DB_USER") or os.getenv("MYSQLUSER")
        password = os.getenv("DB_PASSWORD") or os.getenv("MYSQLPASSWORD")
        database = os.getenv("DB_NAME") or os.getenv("MYSQLDATABASE")
        port = os.getenv("DB_PORT") or os.getenv("MYSQLPORT") or "3306"
        if host and user and database:
            db_url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

    # 3. Default fallback to local SQLite for zero-config runs
    if not db_url:
        db_url = "sqlite:///./movie_booking_db.sqlite"

    # Normalize dialect naming for SQLAlchemy
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    elif db_url.startswith("mysql://") and not db_url.startswith("mysql+pymysql"):
        db_url = db_url.replace("mysql://", "mysql+pymysql://", 1)

    return db_url

DATABASE_URL = get_database_url()

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
