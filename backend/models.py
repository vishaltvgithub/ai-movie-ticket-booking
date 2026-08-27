from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Numeric, Date,
    DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    genre = Column(String(100), nullable=False, index=True)
    language = Column(String(50), nullable=False, index=True)
    duration = Column(Integer, nullable=False) # minutes
    rating = Column(Numeric(3, 1), default=0.0)
    release_date = Column(Date, nullable=False)
    poster_url = Column(String(500), nullable=False)
    director = Column(String(100), nullable=False)
    cast = Column(Text, nullable=False)
    status = Column(String(50), default="now_showing") # 'now_showing', 'trending', 'upcoming'

    shows = relationship("Show", back_populates="movie", cascade="all, delete-orphan")

class Theatre(Base):
    __tablename__ = "theatres"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    location = Column(String(200), nullable=False)

    screens = relationship("Screen", back_populates="theatre", cascade="all, delete-orphan")
    shows = relationship("Show", back_populates="theatre", cascade="all, delete-orphan")

class Screen(Base):
    __tablename__ = "screens"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    theatre_id = Column(Integer, ForeignKey("theatres.id", ondelete="CASCADE"), nullable=False)
    screen_name = Column(String(50), nullable=False)

    theatre = relationship("Theatre", back_populates="screens")
    shows = relationship("Show", back_populates="screen", cascade="all, delete-orphan")
    seats = relationship("Seat", back_populates="screen", cascade="all, delete-orphan")

class Show(Base):
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    movie_id = Column(Integer, ForeignKey("movies.id", ondelete="CASCADE"), nullable=False)
    theatre_id = Column(Integer, ForeignKey("theatres.id", ondelete="CASCADE"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screens.id", ondelete="CASCADE"), nullable=False)
    show_date = Column(Date, nullable=False, index=True)
    show_time = Column(String(20), nullable=False) # e.g. "10:30 AM", "07:15 PM"

    movie = relationship("Movie", back_populates="shows")
    theatre = relationship("Theatre", back_populates="shows")
    screen = relationship("Screen", back_populates="shows")
    bookings = relationship("Booking", back_populates="show", cascade="all, delete-orphan")

class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    screen_id = Column(Integer, ForeignKey("screens.id", ondelete="CASCADE"), nullable=False)
    seat_number = Column(String(10), nullable=False)
    seat_type = Column(String(20), default="Regular") # 'Regular', 'Premium', 'VIP'
    price = Column(Numeric(8, 2), default=150.00)

    screen = relationship("Screen", back_populates="seats")
    booking_seats = relationship("BookingSeat", back_populates="seat", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("screen_id", "seat_number", name="unique_screen_seat"),
    )

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_code = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    show_id = Column(Integer, ForeignKey("shows.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    booking_status = Column(String(30), default="CONFIRMED") # 'CONFIRMED', 'CANCELLED'
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    show = relationship("Show", back_populates="bookings")
    booking_seats = relationship("BookingSeat", back_populates="booking", cascade="all, delete-orphan")

class BookingSeat(Base):
    __tablename__ = "booking_seats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    seat_id = Column(Integer, ForeignKey("seats.id", ondelete="CASCADE"), nullable=False)

    booking = relationship("Booking", back_populates="booking_seats")
    seat = relationship("Seat", back_populates="booking_seats")

    __table_args__ = (
        UniqueConstraint("booking_id", "seat_id", name="unique_booking_seat"),
    )
