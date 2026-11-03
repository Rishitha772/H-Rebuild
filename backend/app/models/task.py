from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    recruiter_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    required_skills: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON or comma-separated
    difficulty: Mapped[str] = mapped_column(String(50), default="Intermediate", nullable=False)
    instructions: Mapped[str] = mapped_column(Text, nullable=False)
    deliverables: Mapped[str] = mapped_column(Text, nullable=False)
    deadline: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    compensation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    openings: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False, index=True)  # "active", "closed", "draft"
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    recruiter = relationship("User", back_populates="created_tasks")
    applications = relationship("Application", back_populates="task", cascade="all, delete-orphan")

