import math
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.recruiter_profile import RecruiterProfile
from app.models.task import Task
from app.models.application import Application
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, TaskListResponse, RecruiterBrief

router = APIRouter()


def _format_task_out(task: Task, db: Session, current_user: Optional[User] = None) -> TaskOut:
    recruiter = task.recruiter
    recruiter_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == recruiter.id).first()
    
    recruiter_brief = RecruiterBrief(
        id=recruiter.id,
        full_name=recruiter.full_name,
        company_name=recruiter_profile.company_name if recruiter_profile else None,
        company_logo=recruiter_profile.company_logo if recruiter_profile else None,
        designation=recruiter_profile.designation if recruiter_profile else None,
    )

    app_count = db.query(func.count(Application.id)).filter(Application.task_id == task.id).scalar() or 0

    has_applied = False
    application_id = None
    application_status = None
    if current_user and current_user.role == "candidate":
        candidate_app = db.query(Application).filter(
            Application.task_id == task.id,
            Application.candidate_id == current_user.id
        ).first()
        if candidate_app:
            has_applied = True
            application_id = candidate_app.id
            application_status = candidate_app.status

    return TaskOut(
        id=task.id,
        recruiter_id=task.recruiter_id,
        title=task.title,
        description=task.description,
        category=task.category,
        required_skills=task.required_skills,
        difficulty=task.difficulty,
        instructions=task.instructions,
        deliverables=task.deliverables,
        deadline=task.deadline,
        compensation=task.compensation,
        openings=task.openings,
        status=task.status,
        created_at=task.created_at,
        updated_at=task.updated_at,
        recruiter=recruiter_brief,
        application_count=app_count,
        has_applied=has_applied,
        application_id=application_id,
        application_status=application_status,
    )


@router.get("", response_model=TaskListResponse)
def get_tasks(
    search: Optional[str] = None,
    category: Optional[str] = None,
    skill: Optional[str] = None,
    difficulty: Optional[str] = None,
    sort_by: str = "newest",  # newest, oldest, deadline, openings
    status_filter: Optional[str] = None,
    recruiter_only: bool = False,
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(deps.get_current_user_optional),
) -> Any:
    query = db.query(Task)

    if recruiter_only:
        if not current_user or current_user.role != "recruiter":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only recruiters can view their private task list",
            )
        query = query.filter(Task.recruiter_id == current_user.id)
    else:
        # By default for public/candidate, show active tasks
        if status_filter:
            query = query.filter(Task.status == status_filter)
        else:
            query = query.filter(Task.status == "active")

    # Search
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Task.title.ilike(search_fmt),
                Task.description.ilike(search_fmt),
                Task.category.ilike(search_fmt),
                Task.required_skills.ilike(search_fmt),
            )
        )

    # Category filter
    if category and category.lower() != "all":
        query = query.filter(Task.category.ilike(category))

    # Difficulty filter
    if difficulty and difficulty.lower() != "all":
        query = query.filter(Task.difficulty.ilike(difficulty))

    # Skill filter
    if skill and skill.lower() != "all":
        query = query.filter(Task.required_skills.ilike(f"%{skill}%"))

    # Sorting
    if sort_by == "oldest":
        query = query.order_by(Task.created_at.asc())
    elif sort_by == "deadline":
        query = query.order_by(Task.deadline.asc().nulls_last())
    elif sort_by == "openings":
        query = query.order_by(Task.openings.desc())
    else:  # newest
        query = query.order_by(Task.created_at.desc())

    total = query.count()
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    offset = (page - 1) * page_size
    tasks = query.offset(offset).limit(page_size).all()

    formatted_tasks = [_format_task_out(t, db, current_user) for t in tasks]

    return {
        "tasks": formatted_tasks,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(deps.get_current_user_optional),
) -> Any:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return _format_task_out(task, db, current_user)


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter),
) -> Any:
    task = Task(
        recruiter_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        category=task_in.category,
        required_skills=task_in.required_skills,
        difficulty=task_in.difficulty,
        instructions=task_in.instructions,
        deliverables=task_in.deliverables,
        deadline=task_in.deadline,
        compensation=task_in.compensation,
        openings=task_in.openings,
        status=task_in.status,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return _format_task_out(task, db, current_user)


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
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
            detail="You are not authorized to update this task",
        )

    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)

    db.add(task)
    db.commit()
    db.refresh(task)
    return _format_task_out(task, db, current_user)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_recruiter),
) -> None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    if task.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this task",
        )
    db.delete(task)
    db.commit()
    return None

