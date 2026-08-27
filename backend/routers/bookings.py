from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Booking, User
from schemas import BookingCreateRequest, BookingResponse
from services.booking_service import create_booking_transaction, format_booking_response

router = APIRouter(tags=["Bookings"])

@router.post("/api/bookings", response_model=BookingResponse)
def create_booking(payload: BookingCreateRequest, db: Session = Depends(get_db)):
    user_id = payload.user_id
    # If no user_id is provided, check or use demo user (id=1)
    if not user_id:
        user = db.query(User).first()
        if not user:
            # Create a default demo user
            user = User(
                name=payload.guest_name or "Demo Guest",
                email=payload.guest_email or "guest@example.com",
                password_hash="demo_hash"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        user_id = user.id

    booking = create_booking_transaction(
        db=db,
        show_id=payload.show_id,
        seat_ids=payload.seat_ids,
        user_id=user_id,
        payment_method=payload.payment_method
    )

    return format_booking_response(db, booking)

@router.get("/api/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    # Support lookup by numeric ID or booking_code (e.g. UPS-MOV-784523)
    if booking_id.isdigit():
        booking = db.query(Booking).filter(Booking.id == int(booking_id)).first()
    else:
        booking = db.query(Booking).filter(Booking.booking_code == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking '{booking_id}' not found."
        )

    return format_booking_response(db, booking)

@router.get("/api/users/{user_id}/bookings", response_model=List[BookingResponse])
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == user_id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [format_booking_response(db, b) for b in bookings]

@router.delete("/api/bookings/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with ID {booking_id} not found."
        )

    booking.booking_status = "CANCELLED"
    db.commit()
    return {"message": f"Booking {booking.booking_code} cancelled successfully."}
