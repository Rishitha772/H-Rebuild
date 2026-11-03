from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.schemas.candidate import CandidateProfileOut, CandidateProfileUpdate

router = APIRouter()


@router.get("/me", response_model=CandidateProfileOut)
def read_candidate_me(
    current_user: User = Depends(deps.get_current_candidate),
    db: Session = Depends(get_db),
) -> Any:
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    profile.user = current_user
    return profile


@router.put("/me", response_model=CandidateProfileOut)
def update_candidate_me(
    profile_in: CandidateProfileUpdate,
    current_user: User = Depends(deps.get_current_candidate),
    db: Session = Depends(get_db),
) -> Any:
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    if profile_in.full_name is not None and profile_in.full_name.strip():
        current_user.full_name = profile_in.full_name.strip()
        db.add(current_user)

    update_fields = [
        "headline",
        "bio",
        "skills",
        "education",
        "experience",
        "portfolio_url",
        "github_url",
        "linkedin_url",
        "resume_url",
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


@router.get("/{candidate_id}", response_model=CandidateProfileOut)
def get_candidate_by_id(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    candidate_user = db.query(User).filter(User.id == candidate_id, User.role == "candidate").first()
    if not candidate_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_id).first()
    if not profile:
        profile = CandidateProfile(user_id=candidate_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    profile.user = candidate_user
    return profile

