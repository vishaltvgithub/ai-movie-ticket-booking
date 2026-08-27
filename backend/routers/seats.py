from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
from models import Show, Seat, BookingSeat
from schemas import SeatResponse, SeatRecommendationResponse
from services.recommendation_service import find_best_seats_for_show

router = APIRouter(tags=["Seats"])

@router.get("/api/shows/{show_id}/seats", response_model=List[SeatResponse])
def get_seats_for_show(show_id: int, db: Session = Depends(get_db)):
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Show with ID {show_id} not found."
        )

    # All seats in this screen
    seats = db.query(Seat).filter(Seat.screen_id == show.screen_id).all()

    # Booked seat IDs for this show
    booked_records = (
        db.query(BookingSeat.seat_id)
        .join(BookingSeat.booking)
        .filter(BookingSeat.booking.has(show_id=show_id))
        .all()
    )
    booked_ids = {r[0] for r in booked_records}

    result = []
    for s in seats:
        result.append(
            SeatResponse(
                id=s.id,
                screen_id=s.screen_id,
                seat_number=s.seat_number,
                seat_type=s.seat_type,
                price=float(s.price),
                is_booked=(s.id in booked_ids)
            )
        )
    return result

@router.get("/api/shows/{show_id}/recommended-seats", response_model=SeatRecommendationResponse)
def get_recommended_seats(
    show_id: int,
    count: int = Query(2, ge=1, le=8, description="Number of seats to recommend"),
    db: Session = Depends(get_db)
):
    best_seats, explanation = find_best_seats_for_show(db, show_id, count=count)
    if not best_seats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No suitable seats available for this show."
        )

    total_price = sum(float(s.price) for s in best_seats)
    seat_responses = [
        SeatResponse(
            id=s.id,
            screen_id=s.screen_id,
            seat_number=s.seat_number,
            seat_type=s.seat_type,
            price=float(s.price),
            is_booked=False
        ) for s in best_seats
    ]

    return SeatRecommendationResponse(
        recommended_seats=seat_responses,
        explanation=explanation,
        total_price=total_price
    )
