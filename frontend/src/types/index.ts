export type UserRole = 'candidate' | 'recruiter';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface CandidateProfile {
  id?: number;
  user_id?: number;
  headline?: string | null;
  bio?: string | null;
  skills?: string | null;
  education?: string | null;
  experience?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  resume_url?: string | null;
  user?: User;
}

export interface RecruiterProfile {
  id?: number;
  user_id?: number;
  company_name?: string | null;
  company_description?: string | null;
  company_website?: string | null;
  company_logo?: string | null;
  designation?: string | null;
  user?: User;
}

export interface RecruiterBrief {
  id: number;
  full_name: string;
  company_name?: string | null;
  company_logo?: string | null;
  designation?: string | null;
}

export interface Task {
  id: number;
  recruiter_id: number;
  title: string;
  description: string;
  category: string;
  required_skills?: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string;
  deliverables: string;
  deadline?: string | null;
  compensation?: string | null;
  openings: number;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
  recruiter?: RecruiterBrief;
  application_count: number;
  has_applied?: boolean;
  application_id?: number | null;
  application_status?: string | null;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Submission {
  id?: number;
  application_id?: number;
  submission_url: string;
  description: string;
  attachment_url?: string | null;
  submitted_at?: string;
}

export interface Evaluation {
  id?: number;
  application_id?: number;
  recruiter_id?: number;
  rating: number;
  feedback?: string | null;
  private_notes?: string | null; // Only recruiter can see
  decision: 'Shortlisted' | 'Rejected' | 'Under Review';
  evaluated_at?: string;
}

export interface CandidateBrief {
  id: number;
  full_name: string;
  email: string;
  headline?: string | null;
  skills?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  resume_url?: string | null;
  bio?: string | null;
}

export interface TaskSummaryBrief {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  required_skills?: string | null;
  deadline?: string | null;
  compensation?: string | null;
  recruiter_company?: string | null;
}

export interface Application {
  id: number;
  candidate_id: number;
  task_id: number;
  status: 'Applied' | 'Submitted' | 'Under Review' | 'Shortlisted' | 'Rejected';
  applied_at: string;
  task?: TaskSummaryBrief;
  candidate?: CandidateBrief;
  submission?: Submission | null;
  evaluation?: Evaluation | null;
}

export interface RecruiterStats {
  total_active_tasks: number;
  total_tasks: number;
  total_applicants: number;
  submissions_awaiting_review: number;
  shortlisted_candidates: number;
}

