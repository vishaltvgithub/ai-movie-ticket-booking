from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
from models import Show
from schemas import ShowResponse

router = APIRouter(tags=["Shows"])

def enrich_show(show: Show) -> dict:
    return {
        "id": show.id,
        "movie_id": show.movie_id,
        "theatre_id": show.theatre_id,
        "screen_id": show.screen_id,
        "show_date": show.show_date,
        "show_time": show.show_time,
        "movie_title": show.movie.title if show.movie else None,
        "theatre_name": show.theatre.name if show.theatre else None,
        "theatre_location": show.theatre.location if show.theatre else None,
        "screen_name": show.screen.screen_name if show.screen else None,
    }

@router.get("/api/shows", response_model=List[ShowResponse])
def get_shows(
    movie_id: Optional[int] = None,
    theatre_id: Optional[int] = None,
    show_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Show)
    if movie_id:
        query = query.filter(Show.movie_id == movie_id)
    if theatre_id:
        query = query.filter(Show.theatre_id == theatre_id)
    if show_date:
        query = query.filter(Show.show_date == show_date)

    shows = query.all()
    return [enrich_show(s) for s in shows]

@router.get("/api/movies/{movie_id}/shows", response_model=List[ShowResponse])
def get_shows_for_movie(
    movie_id: int,
    theatre_id: Optional[int] = None,
    show_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Show).filter(Show.movie_id == movie_id)
    if theatre_id:
        query = query.filter(Show.theatre_id == theatre_id)
    if show_date:
        query = query.filter(Show.show_date == show_date)

    shows = query.all()
    return [enrich_show(s) for s in shows]
