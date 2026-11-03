import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.db.database import SessionLocal
from app.models.evaluation import Evaluation
from app.models.submission import Submission
from app.models.application import Application
from app.models.task import Task
from app.models.candidate_profile import CandidateProfile
from app.models.recruiter_profile import RecruiterProfile
from app.models.user import User


def clear_all_data():
    db = SessionLocal()
    try:
        evals = db.query(Evaluation).delete()
        subs = db.query(Submission).delete()
        apps = db.query(Application).delete()
        tasks = db.query(Task).delete()
        c_profs = db.query(CandidateProfile).delete()
        r_profs = db.query(RecruiterProfile).delete()
        users = db.query(User).delete()
        db.commit()
        print(f"✅ Successfully cleared all data:")
        print(f"   - {users} users")
        print(f"   - {c_profs} candidate profiles")
        print(f"   - {r_profs} recruiter profiles")
        print(f"   - {tasks} tasks")
        print(f"   - {apps} applications")
        print(f"   - {subs} submissions")
        print(f"   - {evals} evaluations")
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    clear_all_data()

