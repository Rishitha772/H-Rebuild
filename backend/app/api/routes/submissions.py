from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate, SubmissionUpdate, SubmissionOut

router = APIRouter()


@router.post("/applications/{application_id}/submit", response_model=SubmissionOut, status_code=status.HTTP_201_CREATED)
def submit_task_solution(
    application_id: int,
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_candidate),
) -> Any:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    if app.candidate_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only submit tasks for your own applications",
        )
    if app.status in ["Shortlisted", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update submission after evaluation decision has been made",
        )

    # Check if submission already exists
    existing_sub = db.query(Submission).filter(Submission.application_id == application_id).first()
    if existing_sub:
        existing_sub.submission_url = submission_in.submission_url
        existing_sub.description = submission_in.description
        existing_sub.attachment_url = submission_in.attachment_url
        existing_sub.submitted_at = datetime.now(timezone.utc)
        sub = existing_sub
    else:
        sub = Submission(
            application_id=application_id,
            submission_url=submission_in.submission_url,
            description=submission_in.description,
            attachment_url=submission_in.attachment_url,
            submitted_at=datetime.now(timezone.utc),
        )
        db.add(sub)

    # Update application status to Submitted if it was Applied
    if app.status == "Applied":
        app.status = "Submitted"
        db.add(app)

    db.commit()
    db.refresh(sub)
    return sub


@router.put("/applications/{application_id}/submission", response_model=SubmissionOut)
def update_task_submission(
    application_id: int,
    submission_in: SubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_candidate),
) -> Any:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    if app.candidate_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own submissions",
        )
    if app.status in ["Shortlisted", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update submission after evaluation decision has been made",
        )

    sub = db.query(Submission).filter(Submission.application_id == application_id).first()
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No submission found for this application",
        )

    if submission_in.submission_url is not None:
        sub.submission_url = submission_in.submission_url
    if submission_in.description is not None:
        sub.description = submission_in.description
    if submission_in.attachment_url is not None:
        sub.attachment_url = submission_in.attachment_url

    sub.submitted_at = datetime.now(timezone.utc)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

