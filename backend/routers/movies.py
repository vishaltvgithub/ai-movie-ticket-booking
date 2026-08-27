from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import get_db
from models import Movie
from schemas import MovieResponse

router = APIRouter(prefix="/api/movies", tags=["Movies"])

@router.get("", response_model=List[MovieResponse])
def get_movies(
    genre: Optional[str] = None,
    language: Optional[str] = None,
    status: Optional[str] = None,
    min_rating: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Movie)
    if genre:
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))
    if language:
        query = query.filter(Movie.language.ilike(f"%{language}%"))
    if status:
        query = query.filter(Movie.status == status)
    if min_rating:
        query = query.filter(Movie.rating >= min_rating)
    
    return query.order_by(Movie.rating.desc()).all()

@router.get("/search", response_model=List[MovieResponse])
def search_movies(
    q: str = Query("", description="Search term"),
    genre: Optional[str] = None,
    language: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_duration: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Movie)
    
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Movie.title.ilike(search_pattern),
                Movie.description.ilike(search_pattern),
                Movie.director.ilike(search_pattern),
                Movie.cast.ilike(search_pattern),
                Movie.genre.ilike(search_pattern),
                Movie.language.ilike(search_pattern)
            )
        )
    
    if genre:
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))
    if language:
        query = query.filter(Movie.language.ilike(f"%{language}%"))
    if min_rating:
        query = query.filter(Movie.rating >= min_rating)
    if max_duration:
        query = query.filter(Movie.duration <= max_duration)

    return query.order_by(Movie.rating.desc()).all()

@router.get("/recommended", response_model=List[MovieResponse])
def get_recommended_movies(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    return db.query(Movie).order_by(Movie.rating.desc()).limit(limit).all()

@router.get("/{id}", response_model=MovieResponse)
def get_movie_by_id(id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with ID {id} not found."
        )
    return movie
