from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class EvaluationBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    feedback: Optional[str] = None
    decision: str = "Shortlisted"  # Shortlisted, Rejected, Under Review


class EvaluationCreate(EvaluationBase):
    private_notes: Optional[str] = None


class EvaluationUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = None
    private_notes: Optional[str] = None
    decision: Optional[str] = None


class EvaluationOutCandidate(EvaluationBase):
    id: int
    application_id: int
    evaluated_at: datetime

    class Config:
        from_attributes = True


class EvaluationOutRecruiter(EvaluationBase):
    id: int
    application_id: int
    recruiter_id: int
    private_notes: Optional[str] = None
    evaluated_at: datetime

    class Config:
        from_attributes = True

