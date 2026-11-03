from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("candidate_id", "task_id", name="uq_candidate_task"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    candidate_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(50), default="Applied", nullable=False, index=True
    )  # Applied, Submitted, Under Review, Shortlisted, Rejected
    applied_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    candidate = relationship("User", back_populates="applications")
    task = relationship("Task", back_populates="applications")
    submission = relationship("Submission", back_populates="application", uselist=False, cascade="all, delete-orphan")
    evaluation = relationship("Evaluation", back_populates="application", uselist=False, cascade="all, delete-orphan")

