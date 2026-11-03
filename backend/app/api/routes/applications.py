from datetime import datetime, timezone
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.task import Task
from app.models.candidate_profile import CandidateProfile
from app.models.recruiter_profile import RecruiterProfile
from app.models.application import Application
from app.models.submission import Submission
from app.models.evaluation import Evaluation
from app.schemas.application import (
    ApplicationOut,
    ApplicationOutRecruiter,
    TaskSummaryBrief,
    CandidateBrief,
)
from app.schemas.submission import SubmissionOut
from app.schemas.evaluation import EvaluationOutCandidate, EvaluationOutRecruiter

router = APIRouter()


class ApplyRequest(BaseModel):
    submission_url: Optional[str] = None
    description: Optional[str] = None
    attachment_url: Optional[str] = None


def _build_task_summary(task: Task, db: Session) -> TaskSummaryBrief:
    recruiter_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == task.recruiter_id).first()
    return TaskSummaryBrief(
        id=task.id,
        title=task.title,
        category=task.category,
        difficulty=task.difficulty,
        required_skills=task.required_skills,
        deadline=task.deadline,
        compensation=task.compensation,
        recruiter_company=recruiter_profile.company_name if recruiter_profile else task.recruiter.full_name,
    )


def _build_candidate_brief(candidate_user: User, db: Session) -> CandidateBrief:
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_user.id).first()
    return CandidateBrief(
        id=candidate_user.id,
        full_name=candidate_user.full_name,
        email=candidate_user.email,
        headline=profile.headline if profile else None,
        skills=profile.skills if profile else None,
        portfolio_url=profile.portfolio_url if profile else None,
        github_url=profile.github_url if profile else None,
        linkedin_url=profile.linkedin_url if profile else None,
        resume_url=profile.resume_url if profile else None,
        bio=profile.bio if profile else None,
    )


@router.post("/tasks/{task_id}/apply", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_task(
    task_id: int,
    apply_in: Optional[ApplyRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_candidate),
) -> Any:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if task.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This task is not currently open for applications",
        )

    # Check for existing application
    existing = db.query(Application).filter(
        Application.candidate_id == current_user.id,
        Application.task_id == task_id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this task",
        )

    # Create application
    has_submission = bool(apply_in and apply_in.submission_url and apply_in.description)
    app_status = "Submitted" if has_submission else "Applied"

    application = Application(
        candidate_id=current_user.id,
        task_id=task_id,
        status=app_status,
        applied_at=datetime.now(timezone.utc),
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # Create submission if provided
    if has_submission:
        sub = Submission(
            application_id=application.id,
            submission_url=apply_in.submission_url,
            description=apply_in.description,
            attachment_url=apply_in.attachment_url,
            submitted_at=datetime.now(timezone.utc),
        )
        db.add(sub)
        db.commit()
        db.refresh(application)

    task_summary = _build_task_summary(task, db)
    cand_brief = _build_candidate_brief(current_user, db)
    submission_out = SubmissionOut.model_validate(application.submission) if application.submission else None

    return ApplicationOut(
        id=application.id,
        candidate_id=application.candidate_id,
        task_id=application.task_id,
        status=application.status,
        applied_at=application.applied_at,
        task=task_summary,
        candidate=cand_brief,
        submission=submission_out,
        evaluation=None,
    )


@router.get("/applications/me", response_model=List[ApplicationOut])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_candidate),
) -> Any:
    applications = db.query(Application).filter(
        Application.candidate_id == current_user.id
    ).order_by(Application.applied_at.desc()).all()

    result = []
    cand_brief = _build_candidate_brief(current_user, db)
    for app in applications:
        task_summary = _build_task_summary(app.task, db)
        sub_out = SubmissionOut.model_validate(app.submission) if app.submission else None
        
        # Candidate must NEVER see private notes!
        eval_out = None
        if app.evaluation:
            eval_out = EvaluationOutCandidate(
                id=app.evaluation.id,
                application_id=app.evaluation.application_id,
                rating=app.evaluation.rating,
                feedback=app.evaluation.feedback,
                decision=app.evaluation.decision,
                evaluated_at=app.evaluation.evaluated_at,
            )

        result.append(
            ApplicationOut(
                id=app.id,
                candidate_id=app.candidate_id,
                task_id=app.task_id,
                status=app.status,
                applied_at=app.applied_at,
                task=task_summary,
                candidate=cand_brief,
                submission=sub_out,
                evaluation=eval_out,
            )
        )
    return result


@router.get("/tasks/{task_id}/applications", response_model=List[ApplicationOutRecruiter])
def get_task_applications_for_recruiter(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter),
) -> Any:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if task.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view applications for this task",
        )

    applications = db.query(Application).filter(
        Application.task_id == task_id
    ).order_by(Application.applied_at.desc()).all()

    task_summary = _build_task_summary(task, db)
    result = []
    for app in applications:
        cand_brief = _build_candidate_brief(app.candidate, db)
        sub_out = SubmissionOut.model_validate(app.submission) if app.submission else None
        eval_out = None
        if app.evaluation:
            eval_out = EvaluationOutRecruiter(
                id=app.evaluation.id,
                application_id=app.evaluation.application_id,
                recruiter_id=app.evaluation.recruiter_id,
                rating=app.evaluation.rating,
                feedback=app.evaluation.feedback,
                private_notes=app.evaluation.private_notes,
                decision=app.evaluation.decision,
                evaluated_at=app.evaluation.evaluated_at,
            )

        result.append(
            ApplicationOutRecruiter(
                id=app.id,
                candidate_id=app.candidate_id,
                task_id=app.task_id,
                status=app.status,
                applied_at=app.applied_at,
                task=task_summary,
                candidate=cand_brief,
                submission=sub_out,
                evaluation=eval_out,
            )
        )
    return result


@router.get("/applications/{application_id}")
def get_application_by_id(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    task_summary = _build_task_summary(app.task, db)
    cand_brief = _build_candidate_brief(app.candidate, db)
    sub_out = SubmissionOut.model_validate(app.submission) if app.submission else None

    # Check permission
    if current_user.role == "candidate":
        if app.candidate_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this application",
            )
        eval_out = None
        if app.evaluation:
            eval_out = EvaluationOutCandidate(
                id=app.evaluation.id,
                application_id=app.evaluation.application_id,
                rating=app.evaluation.rating,
                feedback=app.evaluation.feedback,
                decision=app.evaluation.decision,
                evaluated_at=app.evaluation.evaluated_at,
            )
        return ApplicationOut(
            id=app.id,
            candidate_id=app.candidate_id,
            task_id=app.task_id,
            status=app.status,
            applied_at=app.applied_at,
            task=task_summary,
            candidate=cand_brief,
            submission=sub_out,
            evaluation=eval_out,
        )

    elif current_user.role == "recruiter":
        if app.task.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this application",
            )
        eval_out = None
        if app.evaluation:
            eval_out = EvaluationOutRecruiter(
                id=app.evaluation.id,
                application_id=app.evaluation.application_id,
                recruiter_id=app.evaluation.recruiter_id,
                rating=app.evaluation.rating,
                feedback=app.evaluation.feedback,
                private_notes=app.evaluation.private_notes,
                decision=app.evaluation.decision,
                evaluated_at=app.evaluation.evaluated_at,
            )
        return ApplicationOutRecruiter(
            id=app.id,
            candidate_id=app.candidate_id,
            task_id=app.task_id,
            status=app.status,
            applied_at=app.applied_at,
            task=task_summary,
            candidate=cand_brief,
            submission=sub_out,
            evaluation=eval_out,
        )

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized access",
    )

