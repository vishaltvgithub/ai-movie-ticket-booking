from datetime import date, datetime
from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr, Field

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Movie Schemas ---
class MovieBase(BaseModel):
    title: str
    description: str
    genre: str
    language: str
    duration: int
    rating: float
    release_date: date
    poster_url: str
    director: str
    cast: str
    status: str = "now_showing"

class MovieCreate(MovieBase):
    pass

class MovieResponse(MovieBase):
    id: int

    class Config:
        from_attributes = True

# --- Theatre & Screen Schemas ---
class ScreenResponse(BaseModel):
    id: int
    theatre_id: int
    screen_name: str

    class Config:
        from_attributes = True

class TheatreResponse(BaseModel):
    id: int
    name: str
    location: str
    screens: Optional[List[ScreenResponse]] = []

    class Config:
        from_attributes = True

# --- Show Schemas ---
class ShowResponse(BaseModel):
    id: int
    movie_id: int
    theatre_id: int
    screen_id: int
    show_date: date
    show_time: str
    movie_title: Optional[str] = None
    theatre_name: Optional[str] = None
    theatre_location: Optional[str] = None
    screen_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- Seat Schemas ---
class SeatResponse(BaseModel):
    id: int
    screen_id: int
    seat_number: str
    seat_type: str
    price: float
    is_booked: bool = False

    class Config:
        from_attributes = True

class SeatRecommendationResponse(BaseModel):
    recommended_seats: List[SeatResponse]
    explanation: str
    total_price: float

# --- Booking Schemas ---
class BookingCreateRequest(BaseModel):
    user_id: Optional[int] = None # can come from JWT or guest demo
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    show_id: int
    seat_ids: List[int]
    payment_method: str = "UPI" # 'UPI', 'CARD', 'NETBANKING', 'WALLET'

class BookingResponse(BaseModel):
    id: int
    booking_code: str
    user_id: int
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    show_id: int
    movie_title: str
    movie_poster: Optional[str] = None
    theatre_name: str
    theatre_location: str
    screen_name: str
    show_date: date
    show_time: str
    seats: List[str]
    seat_count: int
    total_amount: float
    booking_status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Chat Schemas ---
class AIChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None
    current_movie_id: Optional[int] = None

class AIChatResponse(BaseModel):
    reply: str
    extracted_preferences: Optional[dict] = None
    recommendations: List[MovieResponse] = []
    quick_suggestions: List[str] = []
    recommended_action: Optional[str] = None # e.g. 'book_movie', 'show_theatres'
    target_movie_id: Optional[int] = None

# --- Dashboard Stats ---
class DashboardStats(BaseModel):
    movies_count: int
    theatres_count: int
    shows_today_count: int
    bookings_count: int
