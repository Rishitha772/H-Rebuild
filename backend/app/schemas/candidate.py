from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl
from app.schemas.user import UserOut


class CandidateProfileBase(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None  # Comma-separated or JSON string
    education: Optional[str] = None
    experience: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None


class CandidateProfileCreate(CandidateProfileBase):
    pass


class CandidateProfileUpdate(CandidateProfileBase):
    full_name: Optional[str] = None


class CandidateProfileOut(CandidateProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True

