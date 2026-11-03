from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.evaluation import Evaluation
from app.schemas.evaluation import EvaluationCreate, EvaluationUpdate, EvaluationOutRecruiter

router = APIRouter()


@router.post("/applications/{application_id}/evaluate", response_model=EvaluationOutRecruiter, status_code=status.HTTP_201_CREATED)
def evaluate_application(
    application_id: int,
    eval_in: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter),
) -> Any:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    if app.task.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to evaluate this application",
        )

    # Check if evaluation already exists
    existing = db.query(Evaluation).filter(Evaluation.application_id == application_id).first()
    if existing:
        existing.rating = eval_in.rating
        existing.feedback = eval_in.feedback
        existing.private_notes = eval_in.private_notes
        existing.decision = eval_in.decision
        existing.evaluated_at = datetime.now(timezone.utc)
        evaluation = existing
    else:
        evaluation = Evaluation(
            application_id=application_id,
            recruiter_id=current_user.id,
            rating=eval_in.rating,
            feedback=eval_in.feedback,
            private_notes=eval_in.private_notes,
            decision=eval_in.decision,
            evaluated_at=datetime.now(timezone.utc),
        )
        db.add(evaluation)

    # Sync application status
    if eval_in.decision in ["Shortlisted", "Rejected", "Under Review"]:
        app.status = eval_in.decision
        db.add(app)

    db.commit()
    db.refresh(evaluation)
    return evaluation


@router.put("/applications/{application_id}/evaluate", response_model=EvaluationOutRecruiter)
def update_application_evaluation(
    application_id: int,
    eval_in: EvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter),
) -> Any:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    if app.task.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to evaluate this application",
        )

    evaluation = db.query(Evaluation).filter(Evaluation.application_id == application_id).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No evaluation found for this application",
        )

    if eval_in.rating is not None:
        evaluation.rating = eval_in.rating
    if eval_in.feedback is not None:
        evaluation.feedback = eval_in.feedback
    if eval_in.private_notes is not None:
        evaluation.private_notes = eval_in.private_notes
    if eval_in.decision is not None:
        evaluation.decision = eval_in.decision
        app.status = eval_in.decision
        db.add(app)

    evaluation.evaluated_at = datetime.now(timezone.utc)
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation

