from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserOut)
def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return current_user


@router.put("/me", response_model=UserOut)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.email is not None and user_in.email != current_user.email:
        existing = db.query(User).filter(User.email == user_in.email.lower()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        current_user.email = user_in.email.lower()

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

