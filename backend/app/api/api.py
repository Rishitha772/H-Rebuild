from fastapi import APIRouter
from app.api.routes import (
    auth,
    users,
    candidates,
    recruiters,
    tasks,
    applications,
    submissions,
    evaluations,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["Candidates"])
api_router.include_router(recruiters.router, prefix="/recruiters", tags=["Recruiters"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(applications.router, tags=["Applications"])
api_router.include_router(submissions.router, tags=["Submissions"])
api_router.include_router(evaluations.router, tags=["Evaluations"])

