import random
import string
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Booking, BookingSeat, Seat, Show, User, Movie, Theatre, Screen

def generate_booking_code() -> str:
    """Generates a professional UPS Hackathon booking code e.g. UPS-MOV-784523"""
    digits = ''.join(random.choices(string.digits, k=6))
    return f"UPS-MOV-{digits}"

def create_booking_transaction(
    db: Session,
    show_id: int,
    seat_ids: List[int],
    user_id: int = 1,
    payment_method: str = "UPI"
) -> Booking:
    """
    Creates a new booking with ACID double-booking prevention.
    """
    # 1. Verify show exists
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Show with id {show_id} not found."
        )

    # 2. Verify seats belong to the screen and exist
    seats = db.query(Seat).filter(Seat.id.in_(seat_ids), Seat.screen_id == show.screen_id).all()
    if len(seats) != len(seat_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more selected seats are invalid for this theatre screen."
        )

    # 3. CRITICAL: Check for existing bookings on these seats for this show (Prevent Double Booking)
    already_booked_subquery = (
        db.query(BookingSeat)
        .join(Booking)
        .filter(
            Booking.show_id == show_id,
            Booking.booking_status == "CONFIRMED",
            BookingSeat.seat_id.in_(seat_ids)
        )
        .all()
    )

    if already_booked_subquery:
        booked_seat_ids = [bs.seat_id for bs in already_booked_subquery]
        booked_seat_names = [s.seat_number for s in seats if s.id in booked_seat_ids]
        names_str = ", ".join(booked_seat_names)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Seat(s) {names_str} have already been booked by another user. Please select other seats."
        )

    # 4. Calculate total amount
    # Base ticket prices + Convenience fee (e.g. ₹30 per ticket) + 18% GST on convenience fee
    base_price = sum([float(s.price) for s in seats])
    convenience_fee_per_ticket = 30.0
    total_convenience = convenience_fee_per_ticket * len(seats)
    tax = round(total_convenience * 0.18, 2)
    grand_total = round(base_price + total_convenience + tax, 2)

    # 5. Create Booking record
    code = generate_booking_code()
    new_booking = Booking(
        booking_code=code,
        user_id=user_id,
        show_id=show_id,
        total_amount=grand_total,
        booking_status="CONFIRMED"
    )
    db.add(new_booking)
    db.flush() # obtain new_booking.id

    # 6. Create BookingSeats records
    for s_id in seat_ids:
        b_seat = BookingSeat(
            booking_id=new_booking.id,
            seat_id=s_id
        )
        db.add(b_seat)

    db.commit()
    db.refresh(new_booking)
    return new_booking

def format_booking_response(db: Session, booking: Booking) -> Dict[str, Any]:
    show = booking.show
    movie = show.movie
    theatre = show.theatre
    screen = show.screen
    user = booking.user

    # Fetch seat numbers
    seat_records = (
        db.query(Seat)
        .join(BookingSeat)
        .filter(BookingSeat.booking_id == booking.id)
        .all()
    )
    seat_numbers = [s.seat_number for s in seat_records]

    return {
        "id": booking.id,
        "booking_code": booking.booking_code,
        "user_id": booking.user_id,
        "user_name": user.name if user else "Guest User",
        "user_email": user.email if user else "demo@example.com",
        "show_id": booking.show_id,
        "movie_title": movie.title,
        "movie_poster": movie.poster_url,
        "theatre_name": theatre.name,
        "theatre_location": theatre.location,
        "screen_name": screen.screen_name,
        "show_date": show.show_date,
        "show_time": show.show_time,
        "seats": seat_numbers,
        "seat_count": len(seat_numbers),
        "total_amount": float(booking.total_amount),
        "booking_status": booking.booking_status,
        "created_at": booking.created_at,
    }
