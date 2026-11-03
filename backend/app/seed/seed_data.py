import os
import sys
from datetime import datetime, timezone, timedelta

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Ensure UTF-8 output encoding on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.db.database import SessionLocal, engine
from app.db.base import Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.recruiter_profile import RecruiterProfile
from app.models.task import Task
from app.models.application import Application
from app.models.submission import Submission
from app.models.evaluation import Evaluation


def seed():
    print("🌱 Starting HireSphere seed script...")
    db = SessionLocal()

    try:
        # Check if users already exist
        existing_count = db.query(User).count()
        if existing_count > 0:
            print(f"ℹ️ Found {existing_count} existing users. Clearing tables for clean seed...")
            db.query(Evaluation).delete()
            db.query(Submission).delete()
            db.query(Application).delete()
            db.query(Task).delete()
            db.query(CandidateProfile).delete()
            db.query(RecruiterProfile).delete()
            db.query(User).delete()
            db.commit()

        # 1. Create Recruiters
        hashed_pw = get_password_hash("Password123!")

        recruiter1 = User(
            full_name="Sarah Jenkins",
            email="sarah.recruiter@stripeflow.io",
            hashed_password=hashed_pw,
            role="recruiter",
            is_active=True,
        )
        recruiter2 = User(
            full_name="Marcus Vance",
            email="marcus.recruiter@apexcloud.dev",
            hashed_password=hashed_pw,
            role="recruiter",
            is_active=True,
        )
        recruiter3 = User(
            full_name="Elena Rostova",
            email="elena.recruiter@pulsehealth.co",
            hashed_password=hashed_pw,
            role="recruiter",
            is_active=True,
        )

        db.add_all([recruiter1, recruiter2, recruiter3])
        db.commit()
        db.refresh(recruiter1)
        db.refresh(recruiter2)
        db.refresh(recruiter3)

        # Recruiter Profiles
        rp1 = RecruiterProfile(
            user_id=recruiter1.id,
            company_name="StripeFlow Systems",
            company_description="Next-generation payment routing infrastructure for enterprise scale and multi-currency payouts.",
            company_website="https://stripeflow.io",
            company_logo="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
            designation="Head of Technical Talent",
        )
        rp2 = RecruiterProfile(
            user_id=recruiter2.id,
            company_name="Apex Cloud Architectures",
            company_description="Building ultra-low latency distributed cloud storage and zero-trust compute clusters.",
            company_website="https://apexcloud.dev",
            company_logo="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80",
            designation="Staff Engineering Director",
        )
        rp3 = RecruiterProfile(
            user_id=recruiter3.id,
            company_name="Pulse Health Tech",
            company_description="AI-assisted diagnostic telemetry and patient care workflow automation.",
            company_website="https://pulsehealth.co",
            company_logo="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=80",
            designation="VP of Engineering",
        )
        db.add_all([rp1, rp2, rp3])
        db.commit()

        # 2. Create Candidates
        cand1 = User(
            full_name="Alex Rivera",
            email="alex.candidate@example.com",
            hashed_password=hashed_pw,
            role="candidate",
            is_active=True,
        )
        cand2 = User(
            full_name="Priya Sharma",
            email="priya.candidate@example.com",
            hashed_password=hashed_pw,
            role="candidate",
            is_active=True,
        )
        cand3 = User(
            full_name="Jordan Taylor",
            email="jordan.candidate@example.com",
            hashed_password=hashed_pw,
            role="candidate",
            is_active=True,
        )

        db.add_all([cand1, cand2, cand3])
        db.commit()
        db.refresh(cand1)
        db.refresh(cand2)
        db.refresh(cand3)

        # Candidate Profiles
        cp1 = CandidateProfile(
            user_id=cand1.id,
            headline="Senior Full-Stack Engineer | React, TypeScript & FastAPI",
            bio="Passionate product-focused builder with 5+ years shipping high-throughput web apps and developer tooling. Obsessed with clean code and great UX.",
            skills="React, TypeScript, FastAPI, Python, PostgreSQL, MySQL, Docker, Tailwind CSS, Redis",
            education="B.S. in Computer Science - UC Berkeley (2019)",
            experience="Senior Frontend Engineer at DataVibe (2022-Present)\nFull-Stack Developer at NextGen Labs (2020-2022)",
            portfolio_url="https://alexrivera.dev",
            github_url="https://github.com/alexrivera-dev",
            linkedin_url="https://linkedin.com/in/alexrivera-builds",
            resume_url="https://alexrivera.dev/resume.pdf",
        )
        cp2 = CandidateProfile(
            user_id=cand2.id,
            headline="Backend Systems & Distributed Architecture Engineer",
            bio="Specialized in Python microservices, database optimizations, event-driven architectures, and high-reliability API design.",
            skills="Python, FastAPI, SQLAlchemy, MySQL, Redis, Kafka, AWS, Docker, Microservices",
            education="M.S. in Software Systems - Georgia Tech (2021)",
            experience="Backend Engineer at CloudScale Systems (2021-2024)\nSoftware Engineer Intern at RedHat (2020)",
            portfolio_url="https://priyasharma.io",
            github_url="https://github.com/priyasharma-code",
            linkedin_url="https://linkedin.com/in/priyasharma-dev",
            resume_url="https://priyasharma.io/resume.pdf",
        )
        cp3 = CandidateProfile(
            user_id=cand3.id,
            headline="Product UI/UX Designer & Design Systems Lead",
            bio="Crafting human-centered digital experiences, accessible UI components, and Figma-to-code design tokens with precision.",
            skills="Figma, UI/UX Design, Design Systems, Tailwind CSS, React, Prototyping, Accessibility, WCAG 2.1",
            education="B.Des in Interaction Design - RISD (2020)",
            experience="Lead Product Designer at StudioCraft (2021-Present)\nUI Designer at PixelForge (2020-2021)",
            portfolio_url="https://jordantaylor.design",
            github_url="https://github.com/jordantaylor-ui",
            linkedin_url="https://linkedin.com/in/jordantaylor-design",
            resume_url="https://jordantaylor.design/resume.pdf",
        )
        db.add_all([cp1, cp2, cp3])
        db.commit()

        # 3. Create Tasks
        now = datetime.now(timezone.utc)
        task1 = Task(
            recruiter_id=recruiter1.id,
            title="Build an Idempotent Webhook Delivery Worker",
            description="Design and implement a robust webhook processing worker that guarantees at-least-once delivery, handles exponential backoff with jitter, and deduplicates retried events safely.",
            category="Backend",
            required_skills="Python, FastAPI, Redis, MySQL, Retry Strategies, Celery",
            difficulty="Advanced",
            instructions=(
                "1. Create a FastAPI service that accepts incoming webhook dispatch triggers.\n"
                "2. Implement an asynchronous queue worker with retry logic (max 5 retries with exponential backoff and randomized jitter).\n"
                "3. Store delivery attempt logs in MySQL with HTTP status codes, latency, and request/response hashes.\n"
                "4. Ensure idempotent dispatch so that multiple triggers for the same event ID do not result in duplicate external HTTP requests.\n"
                "5. Write comprehensive unit and integration tests with pytest."
            ),
            deliverables="Public GitHub repository with README, docker-compose.yml, architecture diagram, and test coverage report (>80%).",
            deadline=now + timedelta(days=14),
            compensation="$1,800 stipend + Fast-track Interview",
            openings=2,
            status="active",
        )

        task2 = Task(
            recruiter_id=recruiter2.id,
            title="Interactive Metrics Dashboard with Virtualized Tables",
            description="Build a high-performance analytics dashboard capable of smoothly scrolling, sorting, and filtering through 50,000 telemetry records without frame drops or lag.",
            category="Frontend",
            required_skills="React, TypeScript, Tailwind CSS, Virtualization, Performance Optimization",
            difficulty="Intermediate",
            instructions=(
                "1. Build responsive summary metric cards (P95/P99 latency, error rates, throughput spikes).\n"
                "2. Implement a virtualized data grid (e.g. using @tanstack/react-virtual or react-window) that handles 50,000 rows seamlessly.\n"
                "3. Add instant column sorting, multi-keyword search, and category chips.\n"
                "4. Maintain a clean, minimalist yellow-and-white theme conforming to our design specs.\n"
                "5. Ensure gzipped bundle footprint stays below 150KB."
            ),
            deliverables="Live demo link (Vercel or Netlify) and clean GitHub repository URL with performance profiling evidence.",
            deadline=now + timedelta(days=10),
            compensation="$1,200 stipend + Direct Staff Interview",
            openings=3,
            status="active",
        )

        task3 = Task(
            recruiter_id=recruiter2.id,
            title="Role-Based Access Control (RBAC) Architecture Implementation",
            description="Implement a fine-grained, secure permission matrix supporting multi-tenant organizations with Admin, Editor, and Viewer roles.",
            category="Fullstack",
            required_skills="FastAPI, React, TypeScript, JWT, MySQL, Security",
            difficulty="Intermediate",
            instructions=(
                "1. Model Organization, User, Role, and Permission tables with proper cascading constraints.\n"
                "2. Write FastAPI route dependencies that enforce permissions dynamically per endpoint.\n"
                "3. Create a clean React administration UI for inviting teammates and editing member permissions.\n"
                "4. Provide audit log tracking for all permission elevation events."
            ),
            deliverables="Working repository with seed scripts, database migrations, and recorded Loom or markdown architecture walkthrough.",
            deadline=now + timedelta(days=18),
            compensation="$1,500 stipend + Senior Role Placement",
            openings=1,
            status="active",
        )

        task4 = Task(
            recruiter_id=recruiter3.id,
            title="Design System & Component Library for Healthcare Portal",
            description="Create an accessible, modern design system for our patient telemetry web app with light and dark mode variants adhering to WCAG 2.1 AAA standards.",
            category="Design",
            required_skills="Figma, UI/UX Design, Design Systems, Accessibility, WCAG 2.1 AAA",
            difficulty="Beginner",
            instructions=(
                "1. Build core atomic components: Buttons, Input fields, Modal dialogs, Timeline, Vital Signs Widget.\n"
                "2. Document color contrast tokens, semantic spacing scales, and typography hierarchies.\n"
                "3. Prototype a high-fidelity 3-step prescription intake workflow with interactive states.\n"
                "4. Include accessibility annotations for screen readers and keyboard navigation."
            ),
            deliverables="Public Figma file link with component variants and auto-layout, plus an exported design-tokens.json specification.",
            deadline=now + timedelta(days=21),
            compensation="$1,000 stipend + Product Design Offer",
            openings=2,
            status="active",
        )

        task5 = Task(
            recruiter_id=recruiter3.id,
            title="Real-Time Telemetry Anomaly Detection Pipeline",
            description="Develop a stream-processing service that ingests patient biometric feeds (heart rate, SpO2) and flags critical anomalies in under 500ms.",
            category="Data & AI",
            required_skills="Python, Pandas, FastAPI, Scikit-learn, Streaming, WebSockets",
            difficulty="Advanced",
            instructions=(
                "1. Ingest simulated streaming time-series biometric data at 10Hz per device.\n"
                "2. Apply dynamic rolling z-score algorithms and isolation forest classifiers to detect irregular spikes.\n"
                "3. Expose a WebSocket endpoint for real-time anomaly alert broadcasts.\n"
                "4. Implement graceful degradation under simulated network latency."
            ),
            deliverables="GitHub repo with sample stream generator, FastAPI inference service, and Jupyter notebook demonstrating validation accuracy.",
            deadline=now + timedelta(days=25),
            compensation="$2,200 stipend + Principal AI Role Interview",
            openings=1,
            status="active",
        )

        db.add_all([task1, task2, task3, task4, task5])
        db.commit()
        db.refresh(task1)
        db.refresh(task2)
        db.refresh(task3)
        db.refresh(task4)
        db.refresh(task5)

        # 4. Applications, Submissions, Evaluations
        # App 1: Alex Rivera applies to Task 2 (Metrics Dashboard) -> Shortlisted
        app1 = Application(
            candidate_id=cand1.id,
            task_id=task2.id,
            status="Shortlisted",
            applied_at=now - timedelta(days=3),
        )
        db.add(app1)
        db.commit()
        db.refresh(app1)

        sub1 = Submission(
            application_id=app1.id,
            submission_url="https://github.com/alexrivera-dev/apex-metrics-virtualizer",
            description=(
                "Implemented virtualized rendering using TanStack Virtual combined with memoized table cells. "
                "Benchmarked at consistent 60fps scrolling across 50,000 telemetry entries. "
                "Live demo deployed at https://apex-metrics-demo.vercel.app with light theme and complete test suite."
            ),
            attachment_url="https://apex-metrics-demo.vercel.app",
            submitted_at=now - timedelta(days=2),
        )
        db.add(sub1)
        db.commit()

        eval1 = Evaluation(
            application_id=app1.id,
            recruiter_id=recruiter2.id,
            rating=5,
            feedback="Outstanding submission! Your profiling showed genuine attention to frame-rate budgets, and the component modularity is production grade. We'd love to invite you to meet our architecture team.",
            private_notes="Alex exceeded expectations. Clear mastery of React performance hooks and virtual rendering. Priority candidate for Staff Frontend role.",
            decision="Shortlisted",
            evaluated_at=now - timedelta(days=1),
        )
        db.add(eval1)
        db.commit()

        # App 2: Priya Sharma applies to Task 1 (Webhook Worker) -> Submitted / Under Review
        app2 = Application(
            candidate_id=cand2.id,
            task_id=task1.id,
            status="Submitted",
            applied_at=now - timedelta(days=2),
        )
        db.add(app2)
        db.commit()
        db.refresh(app2)

        sub2 = Submission(
            application_id=app2.id,
            submission_url="https://github.com/priyasharma-code/idempotent-webhook-worker",
            description=(
                "Engineered with FastAPI, Redis distributed locks for idempotency hashing, "
                "and MySQL for durable delivery history. Implemented Decorrelated Jitter for exponential backoff."
            ),
            attachment_url=None,
            submitted_at=now - timedelta(days=1),
        )
        db.add(sub2)
        db.commit()

        # App 3: Alex Rivera applies to Task 3 (RBAC) -> Applied (in progress)
        app3 = Application(
            candidate_id=cand1.id,
            task_id=task3.id,
            status="Applied",
            applied_at=now - timedelta(hours=12),
        )
        db.add(app3)
        db.commit()

        # App 4: Jordan Taylor applies to Task 4 (Healthcare Design System) -> Submitted
        app4 = Application(
            candidate_id=cand3.id,
            task_id=task4.id,
            status="Submitted",
            applied_at=now - timedelta(days=4),
        )
        db.add(app4)
        db.commit()
        db.refresh(app4)

        sub4 = Submission(
            application_id=app4.id,
            submission_url="https://figma.com/@jordantaylor/pulse-health-design-system",
            description="Comprehensive design system with 40+ atomic components, WCAG AAA color variables, auto-layout tokens, and clickable 3-step intake prototype.",
            attachment_url="https://jordantaylor.design/tokens/pulse-tokens.json",
            submitted_at=now - timedelta(days=3),
        )
        db.add(sub4)
        db.commit()

        print("✅ Seed completed successfully!")
        print("\nDemo Credentials:")
        print("-----------------------------------------------------------------")
        print("Recruiters:")
        print("  - Sarah Jenkins  : sarah.recruiter@stripeflow.io  / Password123!")
        print("  - Marcus Vance   : marcus.recruiter@apexcloud.dev  / Password123!")
        print("  - Elena Rostova  : elena.recruiter@pulsehealth.co  / Password123!")
        print("\nCandidates:")
        print("  - Alex Rivera    : alex.candidate@example.com      / Password123!")
        print("  - Priya Sharma   : priya.candidate@example.com     / Password123!")
        print("  - Jordan Taylor  : jordan.candidate@example.com    / Password123!")
        print("-----------------------------------------------------------------")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
