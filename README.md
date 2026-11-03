# HireSphere — Task-Based Hiring Platform

HireSphere is a full-stack MVP of a modern task-based hiring platform. Instead of resume keyword filtering, **recruiters post practical, real-world engineering challenges**, candidates complete and submit their code repositories or designs, and recruiters evaluate submissions with structured feedback, ratings, and interview shortlisting.

Built with a minimal, premium SaaS aesthetic adhering strictly to the yellow, white, and dark neutral palette.

---

## Architecture & Tech Stack

### Frontend (`/frontend`)
- **React 19** + **TypeScript**
- **Vite 8** (with instant HMR & fast builds)
- **Tailwind CSS v4** with custom HireSphere theme tokens:
  - Brand Yellow: `#FFD600`
  - Bright Yellow: `#FFDF33`
  - White: `#FFFFFF`
  - Dark Neutral: `#1A1A1A`
  - Secondary Text: `#6B7280`
  - Light Border: `#E5E7EB`
  - Light Background: `#FFFDF5`
- **React Router v7** with authenticated & role-protected route guards
- **Axios** with centralized request/response interceptors & token persistence
- **Lucide React** icons

### Backend (`/backend`)
- **Python 3.11+**
- **FastAPI** with modular routers and Pydantic schemas
- **SQLAlchemy 2.0** ORM
- **MySQL 8.0** (`hiresphere_db`)
- **Alembic** database migrations
- **JWT Authentication** (`HS256`) with secure password hashing via `bcrypt`
- Role-Based Access Control (RBAC): Candidate & Recruiter isolation

---

## Database Management & Seed Data

The database starts clean with **zero sample data**.

- **To seed sample data for testing**:
  ```powershell
  cd backend
  .\venv\Scripts\python.exe app\seed\seed_data.py
  ```

- **To remove all sample data at any time**:
  ```powershell
  cd backend
  .\venv\Scripts\python.exe app\seed\clear_data.py
  ```

### Seed Accounts (when seed script is run):

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate** | Alex Rivera | `alex.candidate@example.com` | `Password123!` | Full-Stack Engineer (Shortlisted on Task #2) |
| **Candidate** | Priya Sharma | `priya.candidate@example.com` | `Password123!` | Backend Engineer (Submission on Task #1) |
| **Candidate** | Jordan Taylor | `jordan.candidate@example.com` | `Password123!` | UI/UX Designer (Submission on Task #4) |
| **Recruiter** | Marcus Vance | `marcus.recruiter@apexcloud.dev` | `Password123!` | Apex Cloud (Tasks #2 & #3) |
| **Recruiter** | Sarah Jenkins | `sarah.recruiter@stripeflow.io` | `Password123!` | StripeFlow (Task #1) |
| **Recruiter** | Elena Rostova | `elena.recruiter@pulsehealth.co` | `Password123!` | Pulse Health (Tasks #4 & #5) |

---

## Getting Started & Local Development

### 1. Prerequisites
- **Node.js** (v18+) & **npm** (v9+)
- **Python** (v3.10+)
- **MySQL Server 8.0** running locally on port 3306

---

### 2. MySQL Database Setup

Ensure MySQL Server 8.0 is running and create the `hiresphere_db` database:

```sql
CREATE DATABASE IF NOT EXISTS hiresphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 3. Backend Setup

1. Open a terminal in `backend/`:
```bash
cd backend
```

2. Create and activate a Python virtual environment:
```powershell
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install required Python packages:
```bash
pip install -r requirements.txt
```

4. Configure `.env` file:
Ensure `backend/.env` exists (copied from `backend/.env.example`):
```ini
PROJECT_NAME="HireSphere"
VERSION="1.0.0"
API_V1_STR="/api"

SECRET_KEY="hiresphere-super-secure-secret-key-replace-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

MYSQL_SERVER="127.0.0.1"
MYSQL_PORT=3306
MYSQL_USER="root"
MYSQL_PASSWORD="password"
MYSQL_DB="hiresphere_db"

DATABASE_URL="mysql+pymysql://root:password@127.0.0.1:3306/hiresphere_db"
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

5. Run Alembic Database Migrations:
```bash
alembic upgrade head
```

6. Seed Sample Data:
```bash
python app/seed/seed_data.py
```

7. Start the FastAPI Development Server:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### 4. Frontend Setup

1. Open a new terminal in `frontend/`:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env` file (copied from `frontend/.env.example`):
```ini
VITE_API_URL=http://localhost:8000/api
```

4. Run the Vite development server:
```bash
npm run dev
```

- Web App: `http://localhost:5173`

---

## Application Features & Workflows

### Candidate Journey
1. **Landing & Exploration**: Browse live hiring challenges with search, category filters (Frontend, Backend, Fullstack, Design, AI), and difficulty filters.
2. **Deterministic Skill Matching**: View real-time skill match percentages against every task based on your profile skills, with visual pills showing matched vs missing skills and readiness explanations.
3. **Interactive Skill Tagger**: Select from a 60+ skill taxonomy organized by category or add custom technical competencies in the profile editor.
4. **Apply & Submit**: Apply to a task with a single click, submit repository or live demo links along with architectural explanations and design decisions.
5. **Track Status**: Monitor application states (`Applied` → `Submitted` → `Under Review` → `Shortlisted` / `Rejected`).
6. **Transparent Feedback**: Read recruiter feedback and 5-star scoring directly upon evaluation.
7. **Profile Portfolio**: Manage headline, bio, skills, experience, education, GitHub, LinkedIn, and resume URLs.

### Recruiter Journey
1. **Task Publishing**: Create rich tasks with difficulty rating, detailed instructions, deliverable requirements, stipend/compensation, openings, and standardized skill tags using the autocomplete taxonomy tagger.
2. **Pipeline Dashboard**: Real-time stats on active tasks, applicant counts, submissions awaiting scoring, and shortlisted candidates.
3. **Applicant Review**: Review candidate profiles, inspect submitted GitHub repositories, review live deployment links, and see instant candidate-to-task skill match metrics.
4. **Evaluation Modal**: Grade code submissions (1 to 5 stars), provide candidate-visible constructive feedback, record internal private notes (secured from candidates), and set decisions (`Shortlisted`, `Under Review`, `Rejected`).
5. **Company Branding**: Manage recruiter title, company name, logo, description, and website.

---

## Skill Matching Engine & Taxonomy

HireSphere includes a client & server synchronized technical skill matcher:
- **Taxonomy Categories**: Frontend, Backend, Database, Cloud & DevOps, Mobile, Machine Learning & AI, UI/UX Design.
- **Normalization & Aliases**: Automatically matches variations like `react` ↔ `React.js` ↔ `ReactJS`, `node` ↔ `Node.js`, `ts` ↔ `TypeScript`, `py` ↔ `Python`.
- **Match Tiers**:
  - `100%`: Perfect Match
  - `75% - 99%`: Strong Match
  - `50% - 74%`: Good Match
  - `< 50%`: Potential Match
- **Visual Feedback**: Appears on Task Cards, Task Detail Pages, Recommended Tasks on Candidate Dashboard, and Recruiter Applicant Review Cards.

---

## Leadership & Vision
- **Founder & CEO**: **Rishitha Khandesh**
- **Mission**: Replacing subjective resume filtering with meritocratic, proof-of-work hiring where candidates showcase real skills and recruiters evaluate verified competence.
- **Brand System**: Minimal, high-contrast, premium SaaS aesthetic adhering strictly to Brand Yellow (`#FFD600`, `#FFDF33`), White (`#FFFFFF`), and dark/neutral tones (`#1A1A1A`, `#6B7280`, `#FFFDF5`).

---

## Security & Privacy Protections
- **Password Protection**: Passwords securely hashed with `bcrypt` (never stored in plain text).
- **Recruiter Notes Confidentiality**: `private_notes` field is strictly excluded in candidate API schemas and candidate responses.
- **Strict Role Boundaries**: Candidates cannot access recruiter dashboards or applicant evaluation endpoints; recruiters cannot apply to tasks.
- **Deduplication**: Unique database constraints prevent multiple applications by the same candidate to the same task.
- **CORS Protection**: Whitelisted origin policies for local frontend environments.

