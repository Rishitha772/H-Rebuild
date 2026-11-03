from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.submission import SubmissionOut
from app.schemas.evaluation import EvaluationOutCandidate, EvaluationOutRecruiter
from app.schemas.candidate import CandidateProfileOut
from app.schemas.user import UserOut


class TaskSummaryBrief(BaseModel):
    id: int
    title: str
    category: str
    difficulty: str
    required_skills: Optional[str] = None
    deadline: Optional[datetime] = None
    compensation: Optional[str] = None
    recruiter_company: Optional[str] = None


class CandidateBrief(BaseModel):
    id: int
    full_name: str
    email: str
    headline: Optional[str] = None
    skills: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    bio: Optional[str] = None


class ApplicationBase(BaseModel):
    pass


class ApplicationCreate(BaseModel):
    pass  # Can apply directly or with initial submission


class ApplicationOut(BaseModel):
    id: int
    candidate_id: int
    task_id: int
    status: str
    applied_at: datetime
    task: Optional[TaskSummaryBrief] = None
    candidate: Optional[CandidateBrief] = None
    submission: Optional[SubmissionOut] = None
    evaluation: Optional[EvaluationOutCandidate] = None

    class Config:
        from_attributes = True


class ApplicationOutRecruiter(BaseModel):
    id: int
    candidate_id: int
    task_id: int
    status: str
    applied_at: datetime
    task: Optional[TaskSummaryBrief] = None
    candidate: Optional[CandidateBrief] = None
    submission: Optional[SubmissionOut] = None
    evaluation: Optional[EvaluationOutRecruiter] = None

    class Config:
        from_attributes = True

