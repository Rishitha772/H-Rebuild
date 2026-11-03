from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class SubmissionBase(BaseModel):
    submission_url: str
    description: str
    attachment_url: Optional[str] = None


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionUpdate(BaseModel):
    submission_url: Optional[str] = None
    description: Optional[str] = None
    attachment_url: Optional[str] = None


class SubmissionOut(SubmissionBase):
    id: int
    application_id: int
    submitted_at: datetime

    class Config:
        from_attributes = True

