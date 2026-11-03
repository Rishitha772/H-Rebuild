from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserOut


class RecruiterProfileBase(BaseModel):
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    company_website: Optional[str] = None
    company_logo: Optional[str] = None
    designation: Optional[str] = None


class RecruiterProfileCreate(RecruiterProfileBase):
    pass


class RecruiterProfileUpdate(RecruiterProfileBase):
    full_name: Optional[str] = None


class RecruiterProfileOut(RecruiterProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True

