from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.recruiter_profile import RecruiterProfile
from app.models.task import Task
from app.models.application import Application
from app.models.submission import Submission
from app.models.evaluation import Evaluation
from app.schemas.recruiter import RecruiterProfileOut, RecruiterProfileUpdate

router = APIRouter()


@router.get("/me", response_model=RecruiterProfileOut)
def read_recruiter_me(
    current_user: User = Depends(deps.get_current_recruiter),
    db: Session = Depends(get_db),
) -> Any:
    profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not profile:
        profile = RecruiterProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    profile.user = current_user
    return profile


@router.put("/me", response_model=RecruiterProfileOut)
def update_recruiter_me(
    profile_in: RecruiterProfileUpdate,
    current_user: User = Depends(deps.get_current_recruiter),
    db: Session = Depends(get_db),
) -> Any:
    profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not profile:
        profile = RecruiterProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    if profile_in.full_name is not None and profile_in.full_name.strip():
        current_user.full_name = profile_in.full_name.strip()
        db.add(current_user)

    update_fields = [
        "company_name",
        "company_description",
        "company_website",
        "company_logo",
        "designation",
    ]
    for field in update_fields:
        val = getattr(profile_in, field)
        if val is not None:
            setattr(profile, field, val)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    db.refresh(current_user)
    profile.user = current_user
    return profile


@router.get("/stats")
def get_recruiter_dashboard_stats(
    current_user: User = Depends(deps.get_current_recruiter),
    db: Session = Depends(get_db),
) -> Any:
    # 1. Total active tasks
    total_active_tasks = db.query(func.count(Task.id)).filter(
        Task.recruiter_id == current_user.id,
        Task.status == "active"
    ).scalar() or 0

    total_tasks = db.query(func.count(Task.id)).filter(
        Task.recruiter_id == current_user.id
    ).scalar() or 0

    # 2. Total applicants across recruiter's tasks
    recruiter_task_ids = [t.id for t in db.query(Task.id).filter(Task.recruiter_id == current_user.id).all()]

    if not recruiter_task_ids:
        return {
            "total_active_tasks": total_active_tasks,
            "total_tasks": total_tasks,
            "total_applicants": 0,
            "submissions_awaiting_review": 0,
            "shortlisted_candidates": 0,
        }

    total_applicants = db.query(func.count(Application.id)).filter(
        Application.task_id.in_(recruiter_task_ids)
    ).scalar() or 0

    # Submissions awaiting review: has a submission, but status is 'Submitted' or no evaluation yet
    submissions_awaiting_review = db.query(func.count(Application.id)).join(
        Submission, Submission.application_id == Application.id
    ).outerjoin(
        Evaluation, Evaluation.application_id == Application.id
    ).filter(
        Application.task_id.in_(recruiter_task_ids),
        Evaluation.id.is_(None)
    ).scalar() or 0

    shortlisted_candidates = db.query(func.count(Application.id)).filter(
        Application.task_id.in_(recruiter_task_ids),
        Application.status == "Shortlisted"
    ).scalar() or 0

    return {
        "total_active_tasks": total_active_tasks,
        "total_tasks": total_tasks,
        "total_applicants": total_applicants,
        "submissions_awaiting_review": submissions_awaiting_review,
        "shortlisted_candidates": shortlisted_candidates,
    }

