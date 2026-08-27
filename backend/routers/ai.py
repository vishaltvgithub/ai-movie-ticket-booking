from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import AIChatRequest, AIChatResponse, MovieResponse
from services.ai_service import process_chat_message

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_cineai(payload: AIChatRequest, db: Session = Depends(get_db)):
    result = await process_chat_message(
        db=db,
        message=payload.message,
        current_movie_id=payload.current_movie_id
    )

    # Format movie recommendations into Pydantic models
    movie_responses = [MovieResponse.model_validate(m) for m in result["recommendations"]]

    return AIChatResponse(
        reply=result["reply"],
        extracted_preferences=result.get("extracted_preferences"),
        recommendations=movie_responses,
        quick_suggestions=result.get("quick_suggestions", [])
    )
