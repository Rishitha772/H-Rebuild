from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.user import UserOut


class TaskBase(BaseModel):
    title: str
    description: str
    category: str
    required_skills: Optional[str] = None
    difficulty: str = "Intermediate"
    instructions: str
    deliverables: str
    deadline: Optional[datetime] = None
    compensation: Optional[str] = None
    openings: int = 1
    status: str = "active"


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    required_skills: Optional[str] = None
    difficulty: Optional[str] = None
    instructions: Optional[str] = None
    deliverables: Optional[str] = None
    deadline: Optional[datetime] = None
    compensation: Optional[str] = None
    openings: Optional[int] = None
    status: Optional[str] = None


class RecruiterBrief(BaseModel):
    id: int
    full_name: str
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    designation: Optional[str] = None


class TaskOut(TaskBase):
    id: int
    recruiter_id: int
    created_at: datetime
    updated_at: datetime
    recruiter: Optional[RecruiterBrief] = None
    application_count: int = 0
    has_applied: Optional[bool] = False
    application_id: Optional[int] = None
    application_status: Optional[str] = None

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    tasks: List[TaskOut]
    total: int
    page: int
    page_size: int
    total_pages: int

