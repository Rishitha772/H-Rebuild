from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.db.database import get_db
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.recruiter_profile import RecruiterProfile
from app.schemas.auth import Token, LoginRequest, RegisterRequest
from app.schemas.user import UserOut

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(
    register_in: RegisterRequest,
    db: Session = Depends(get_db),
) -> Any:
    # Check if user already exists
    user = db.query(User).filter(User.email == register_in.email.lower()).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    role = register_in.role.lower().strip()
    if role not in ["candidate", "recruiter"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'candidate' or 'recruiter'",
        )

    # Hash password & create user
    hashed_password = security.get_password_hash(register_in.password)
    user = User(
        full_name=register_in.full_name.strip(),
        email=register_in.email.lower().strip(),
        hashed_password=hashed_password,
        role=role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create matching profile
    if role == "candidate":
        profile = CandidateProfile(user_id=user.id)
        db.add(profile)
    else:
        profile = RecruiterProfile(user_id=user.id)
        db.add(profile)
    db.commit()

    # Generate token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
    }


@router.post("/login", response_model=Token)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
) -> Any:
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not security.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
    }


@router.get("/me")
def get_current_user_info(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    res = {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }

    if current_user.role == "candidate":
        profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
        res["profile"] = {
            "id": profile.id if profile else None,
            "headline": profile.headline if profile else None,
            "bio": profile.bio if profile else None,
            "skills": profile.skills if profile else None,
            "education": profile.education if profile else None,
            "experience": profile.experience if profile else None,
            "portfolio_url": profile.portfolio_url if profile else None,
            "github_url": profile.github_url if profile else None,
            "linkedin_url": profile.linkedin_url if profile else None,
            "resume_url": profile.resume_url if profile else None,
        }
    elif current_user.role == "recruiter":
        profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
        res["profile"] = {
            "id": profile.id if profile else None,
            "company_name": profile.company_name if profile else None,
            "company_description": profile.company_description if profile else None,
            "company_website": profile.company_website if profile else None,
            "company_logo": profile.company_logo if profile else None,
            "designation": profile.designation if profile else None,
        }

    return res

