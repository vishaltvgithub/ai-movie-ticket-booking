from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Theatre, Show
from schemas import TheatreResponse

router = APIRouter(tags=["Theatres"])

@router.get("/api/theatres", response_model=List[TheatreResponse])
def get_all_theatres(db: Session = Depends(get_db)):
    return db.query(Theatre).all()

@router.get("/api/movies/{movie_id}/theatres", response_model=List[TheatreResponse])
def get_theatres_by_movie(movie_id: int, db: Session = Depends(get_db)):
    # Find all theatres currently running shows for this movie
    theatre_ids = db.query(Show.theatre_id).filter(Show.movie_id == movie_id).distinct().all()
    ids = [t[0] for t in theatre_ids]
    if not ids:
        return []
    return db.query(Theatre).filter(Theatre.id.in_(ids)).all()
