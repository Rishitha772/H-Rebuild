import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { applicationsApi } from '../api/applications';
import { profilesApi } from '../api/profiles';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Task, Application } from '../types';
import { calculateSkillMatch, SkillMatchResult } from '../utils/skillMatcher';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import DifficultyBadge from '../components/DifficultyBadge';
import Modal from '../components/Modal';
import {
  Calendar,
  DollarSign,
  Users,
  Building,
  CheckCircle2,
  FileText,
  Send,
  ArrowLeft,
  ExternalLink,
  Edit,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);

  // Application modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const loadTask = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getTaskById(taskId);
      setTask(data);
      if (user?.role === 'candidate') {
        try {
          const prof = await profilesApi.getCandidateProfile();
          if (prof.skills) {
            setCandidateSkills(
              prof.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            );
          }
        } catch (e) {
          // ignore profile fetch error
        }
      }
    } catch (err) {
      console.error('Failed to load task', err);
      toastError('Task not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await applicationsApi.applyToTask(taskId, {
        submission_url: submissionUrl.trim() || undefined,
        description: description.trim() || undefined,
        attachment_url: attachmentUrl.trim() || undefined,
      });

      success(
        submissionUrl.trim()
          ? 'Application & solution submitted successfully!'
          : 'Application submitted! You can submit your solution anytime before the deadline.'
      );
      setApplyModalOpen(false);
      loadTask();
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Failed to submit application';
      toastError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 w-full animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-48 bg-white border border-[#E5E7EB] rounded-2xl"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Task Not Found</h2>
          <p className="text-sm text-[#6B7280] mt-2 mb-6">The requested hiring task may have been closed or removed.</p>
          <Link to="/tasks" className="px-5 py-2.5 rounded-xl bg-[#FFD600] text-sm font-bold text-[#1A1A1A]">
            Back to Open Tasks
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.role === 'recruiter' && user.id === task.recruiter_id;
  const isCandidate = user?.role === 'candidate';

  const skillsList = task.required_skills
    ? task.required_skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Rolling Basis';

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-between selection:bg-[#FFD600]">
      {!isAuthenticated && <Navbar />}

      <div className={`flex-1 ${isAuthenticated && user ? 'flex' : ''}`}>
        {isAuthenticated && user && <Sidebar role={user.role} />}

        <main className={`w-full flex-1 py-10 px-4 sm:px-6 lg:px-8 ${isAuthenticated ? 'max-w-5xl p-6 sm:p-10' : 'max-w-5xl mx-auto'}`}>
          {/* Breadcrumb */}
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all tasks
        </Link>

        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-gray-100 px-3 py-1 rounded-md">
                  {task.category}
                </span>
                <DifficultyBadge difficulty={task.difficulty} />
                {task.has_applied && task.application_status && (
                  <StatusBadge status={task.application_status} />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight leading-snug">
                {task.title}
              </h1>

              {/* Company & Recruiter info */}
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <Building className="w-4 h-4 text-[#1A1A1A]" />
                <span className="font-semibold text-[#1A1A1A]">
                  {task.recruiter?.company_name || task.recruiter?.full_name}
                </span>
                {task.recruiter?.designation && (
                  <span>• {task.recruiter.designation}</span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              {isOwner ? (
                <>
                  <Link
                    to={`/recruiter/tasks/${task.id}/applicants`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] font-bold text-sm text-[#1A1A1A] shadow-xs transition"
                  >
                    <Users className="w-4 h-4" />
                    Review Applicants ({task.application_count})
                  </Link>
                  <Link
                    to={`/recruiter/tasks/${task.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#E5E7EB] hover:border-black font-semibold text-sm text-[#1A1A1A] bg-white transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Task
                  </Link>
                </>
              ) : isCandidate ? (
                task.has_applied ? (
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#FFD600] text-center">
                    <p className="text-xs font-semibold text-[#6B7280] mb-1">Status</p>
                    <StatusBadge status={task.application_status || 'Applied'} />
                    <Link
                      to="/candidate/applications"
                      className="block mt-3 text-xs font-bold text-[#1A1A1A] hover:underline"
                    >
                      View in My Applications →
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] font-bold text-sm text-[#1A1A1A] shadow-xs transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Apply to Task
                    <Send className="w-4 h-4" />
                  </button>
                )
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] font-bold text-sm text-[#1A1A1A] shadow-xs transition"
                >
                  Log In to Apply
                </Link>
              ) : null}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#E5E7EB]">
            <div>
              <p className="text-xs text-[#6B7280]">Compensation</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                {task.compensation || 'Disclosed upon review'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Deadline</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                {formattedDeadline}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Openings</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                {task.openings} {task.openings === 1 ? 'position' : 'positions'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Total Applicants</p>
              <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                {task.application_count} candidates
              </p>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / Description */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Task Overview</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {/* Task Instructions */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Instructions & Requirements</h2>
              <div className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line bg-[#FFFDF5] p-5 rounded-2xl border border-[#E5E7EB]">
                {task.instructions}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Expected Deliverables</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                {task.deliverables}
              </p>
            </div>
          </div>

          {/* Right Sidebar Details */}
          <div className="space-y-6">
            {/* Candidate Skill Match Indicator */}
            {isCandidate && candidateSkills.length > 0 && skillsList.length > 0 && (
              (() => {
                const match = calculateSkillMatch(candidateSkills, skillsList);
                return (
                  <div className="bg-[#FFFDF5] rounded-3xl border border-[#FFD600] p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                        Skill Match Result
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFD600] text-[#1A1A1A]">
                        {match.matchPercentage}% · {match.matchTier}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-[#FFD600] rounded-full transition-all duration-500"
                        style={{ width: `${match.matchPercentage}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {match.explanation}
                    </p>

                    {match.matchedSkills.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider block mb-1">
                          Matched Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills.map((ms, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-semibold bg-white text-[#1A1A1A] border border-[#FFD600] px-2 py-0.5 rounded-md"
                            >
                              ✓ {ms}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* Required Skills Card */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-4">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#FFFDF5] text-[#1A1A1A] border border-[#FFD600]/40 font-semibold px-3 py-1 rounded-xl"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Process Card */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                Submission Guidelines
              </h3>
              <ul className="space-y-3 text-xs text-[#6B7280]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Public GitHub repository link or deploy URL.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Include architecture decisions & setup steps in your README.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Recruiters evaluate every genuine submission within 7 business days.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>

    {/* Application & Submission Modal */}
    <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply & Submit Solution"
        subtitle={`Applying for: ${task.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div className="p-3 bg-[#FFFDF5] border border-[#FFD600]/40 rounded-xl text-xs text-[#1A1A1A]">
            You can apply now and provide your solution links immediately, or submit them later from your Candidate Dashboard.
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Solution Repository or Live Demo URL
            </label>
            <input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/your-username/solution-repo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
            <p className="text-[11px] text-[#6B7280] mt-1">
              GitHub repo, Figma URL, or live demo link.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Solution Summary / Notes for Recruiter
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your architecture, performance tradeoffs, or key decisions made during implementation..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Optional Secondary Attachment / Documentation Link
            </label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://your-docs.com or Loom video URL"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Submitting Application...' : 'Confirm & Apply'}
            </button>
          </div>
        </form>
      </Modal>

      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default TaskDetail;

