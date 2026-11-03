import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { tasksApi } from '../../api/tasks';
import { applicationsApi } from '../../api/applications';
import { useToast } from '../../context/ToastContext';
import { Task, Application } from '../../types';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { calculateSkillMatch, parseSkills } from '../../utils/skillMatcher';
import {
  Users,
  Star,
  ExternalLink,
  MessageSquare,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  Code2,
  Globe,
  FileText,
  Share2,
  Filter,
  Sparkles,
} from 'lucide-react';

export const ApplicantManagement: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const { success, error: toastError } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | 'all'>(
    id ? Number(id) : 'all'
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Evaluation Modal State
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [privateNotes, setPrivateNotes] = useState<string>('');
  const [decision, setDecision] = useState<'Shortlisted' | 'Rejected' | 'Under Review'>('Shortlisted');
  const [submittingEval, setSubmittingEval] = useState(false);

  // Load recruiter tasks first
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await tasksApi.getTasks({ recruiter_only: true, page_size: 50 });
        setTasks(data.tasks);
        if (id) {
          setSelectedTaskId(Number(id));
        } else if (data.tasks.length > 0 && selectedTaskId === 'all') {
          // Keep all or choose first
        }
      } catch (err) {
        console.error('Failed to load recruiter tasks', err);
      }
    };
    loadTasks();
  }, [id]);

  // Load applications based on selectedTaskId
  const loadApplications = async () => {
    setLoading(true);
    try {
      if (selectedTaskId !== 'all') {
        const data = await applicationsApi.getTaskApplications(Number(selectedTaskId));
        setApplications(data);
      } else {
        // Fetch applications across all tasks
        const allTasksData = await tasksApi.getTasks({ recruiter_only: true, page_size: 50 });
        const appPromises = allTasksData.tasks.map((t) =>
          applicationsApi.getTaskApplications(t.id).catch(() => [] as Application[])
        );
        const results = await Promise.all(appPromises);
        const combined = results.flat();
        setApplications(combined);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
      toastError('Could not fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [selectedTaskId]);

  const openEvaluationModal = (app: Application) => {
    setSelectedApp(app);
    if (app.evaluation) {
      setRating(app.evaluation.rating || 5);
      setFeedback(app.evaluation.feedback || '');
      setPrivateNotes(app.evaluation.private_notes || '');
      setDecision(app.evaluation.decision || 'Shortlisted');
    } else {
      setRating(5);
      setFeedback('');
      setPrivateNotes('');
      setDecision('Shortlisted');
    }
    setEvaluationModalOpen(true);
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmittingEval(true);
    try {
      await applicationsApi.evaluateApplication(selectedApp.id, {
        rating,
        feedback: feedback.trim() || undefined,
        private_notes: privateNotes.trim() || undefined,
        decision,
      });

      success(`Candidate evaluated and marked as ${decision}!`);
      setEvaluationModalOpen(false);
      loadApplications();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit evaluation';
      toastError(msg);
    } finally {
      setSubmittingEval(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="recruiter" />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                Applicant Review & Evaluations
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Inspect candidate solutions, review code repositories, and shortlist top talent.
              </p>
            </div>

            {/* Task filter selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280]">Filter Task:</span>
              <select
                value={selectedTaskId}
                onChange={(e) =>
                  setSelectedTaskId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="py-2 px-3 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1A1A1A] bg-white focus:outline-none focus:border-black max-w-xs"
              >
                <option value="all">All My Tasks</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-white rounded-3xl border border-[#E5E7EB] animate-pulse"></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="Candidates have not applied to the selected task yet. Make sure your task is active."
              actionText="View All Tasks"
              onAction={() => setSelectedTaskId('all')}
            />
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#FFD600] transition p-6 sm:p-8 shadow-xs space-y-6"
                >
                  {/* Top Bar: Candidate Header & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFD600] flex items-center justify-center font-extrabold text-lg text-[#1A1A1A] shrink-0">
                        {app.candidate?.full_name ? app.candidate.full_name[0].toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-[#1A1A1A]">
                            {app.candidate?.full_name}
                          </h3>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="text-xs text-[#6B7280]">{app.candidate?.headline || app.candidate?.email}</p>
                        <p className="text-xs text-[#1A1A1A] font-semibold mt-1">
                          Applied for: <span className="underline">{app.task?.title}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => openEvaluationModal(app)}
                        className="px-5 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] shadow-xs transition flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5" />
                        {app.evaluation ? 'Update Evaluation' : 'Evaluate Candidate'}
                      </button>
                    </div>
                  </div>

                  {/* Candidate Match, Skills & Bio */}
                  {(() => {
                    const taskSkills = app.task?.required_skills ? parseSkills(app.task.required_skills) : [];
                    const candSkills = app.candidate?.skills ? parseSkills(app.candidate.skills) : [];
                    const match = taskSkills.length > 0 && candSkills.length > 0 ? calculateSkillMatch(candSkills, taskSkills) : null;

                    return (
                      <div className="space-y-3">
                        {match && (
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFD600]/80">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-black bg-[#FFD600] px-2.5 py-1 rounded-full shadow-xs">
                                <Sparkles className="w-3.5 h-3.5" />
                                {match.matchPercentage}% Skill Match
                              </span>
                              <span className="text-xs text-[#1A1A1A] font-medium hidden sm:inline">
                                {match.explanation}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-[#6B7280]">
                              Matched {match.matchedSkills.length} of {taskSkills.length} required
                            </div>
                          </div>
                        )}

                        {(app.candidate?.skills || app.candidate?.bio) && (
                          <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E5E7EB] space-y-2">
                            {candSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[11px] font-bold text-[#6B7280] mr-1 uppercase">Skills:</span>
                                {candSkills.map((s: string, idx: number) => {
                                  const isMatched = match?.matchedSkills.some((m: string) => m.toLowerCase() === s.toLowerCase());
                                  return (
                                    <span
                                      key={idx}
                                      className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                                        isMatched
                                          ? 'bg-[#FFD600] text-black border-[#FFD600] font-bold'
                                          : 'bg-white text-[#1A1A1A] border-[#E5E7EB]'
                                      }`}
                                    >
                                      {s}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            {app.candidate?.bio && (
                              <p className="text-xs text-[#6B7280] leading-relaxed pt-1">
                                {app.candidate.bio}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Candidate Portfolio & Profile Links */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1A1A1A] pt-1">
                    {app.candidate?.github_url && (
                      <a
                        href={app.candidate.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-[#1A1A1A]"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        GitHub Profile
                      </a>
                    )}
                    {app.candidate?.portfolio_url && (
                      <a
                        href={app.candidate.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-[#1A1A1A]"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Portfolio Site
                      </a>
                    )}
                    {app.candidate?.linkedin_url && (
                      <a
                        href={app.candidate.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-[#1A1A1A]"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                    )}
                    {app.candidate?.resume_url && (
                      <a
                        href={app.candidate.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline text-[#1A1A1A]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Resume PDF
                      </a>
                    )}
                  </div>

                  {/* Submission Deliverable Review Box */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
                      Task Deliverable Submission
                    </h4>

                    {app.submission ? (
                      <div className="p-4 rounded-2xl bg-white border border-[#1A1A1A]/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <a
                            href={app.submission.submission_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#1A1A1A] hover:underline"
                          >
                            <span>Inspect Code Repository / Deliverable:</span>
                            <span className="text-[#6B7280] font-normal underline">{app.submission.submission_url}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]" />
                          </a>

                          <span className="text-xs text-[#6B7280]">
                            Submitted: {new Date(app.submission.submitted_at || '').toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-line bg-[#FFFDF5] p-3 rounded-xl border border-[#E5E7EB]">
                          {app.submission.description}
                        </p>

                        {app.submission.attachment_url && (
                          <a
                            href={app.submission.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A1A] hover:underline"
                          >
                            <span>Live Demo / Documentation:</span> {app.submission.attachment_url} ↗
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-[#E5E7EB] text-xs text-[#6B7280]">
                        The candidate has applied to this task, but has not uploaded their final code submission yet.
                      </div>
                    )}
                  </div>

                  {/* Current Evaluation Box (Visible to Recruiter) */}
                  {app.evaluation && (
                    <div className="p-5 rounded-2xl bg-[#FFFDF5] border border-[#FFD600] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                          Your Evaluation Recorded
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= app.evaluation!.rating
                                  ? 'fill-[#FFD600] text-[#FFD600]'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-[#1A1A1A] ml-1">
                            {app.evaluation.rating}/5
                          </span>
                        </div>
                      </div>

                      {app.evaluation.feedback && (
                        <div className="text-xs text-[#1A1A1A]">
                          <strong className="block text-[#6B7280] mb-0.5">Candidate Feedback (Visible to candidate):</strong>
                          {app.evaluation.feedback}
                        </div>
                      )}

                      {app.evaluation.private_notes && (
                        <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-xs text-[#1A1A1A]">
                          <div className="flex items-center gap-1 text-[#6B7280] font-bold mb-1">
                            <Lock className="w-3 h-3 text-[#1A1A1A]" />
                            Internal Recruiter Private Notes (Hidden from Candidate):
                          </div>
                          {app.evaluation.private_notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

      {/* Evaluation Modal */}
      <Modal
        isOpen={evaluationModalOpen}
        onClose={() => setEvaluationModalOpen(false)}
        title="Candidate Evaluation & Decision"
        subtitle={`Candidate: ${selectedApp?.candidate?.full_name} • ${selectedApp?.task?.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEvaluation} className="space-y-4">
          {/* Decision Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Evaluation Decision *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('Shortlisted')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  decision === 'Shortlisted'
                    ? 'bg-[#FFD600] border-[#FFD600] text-[#1A1A1A] shadow-xs'
                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                ★ Shortlist Candidate
              </button>
              <button
                type="button"
                onClick={() => setDecision('Under Review')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  decision === 'Under Review'
                    ? 'bg-white border-[#1A1A1A] text-[#1A1A1A]'
                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Under Review
              </button>
              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  decision === 'Rejected'
                    ? 'bg-gray-100 border-gray-400 text-gray-700'
                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-black'
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Code & Architecture Rating (1 - 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-[#FFD600] text-[#FFD600]' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-[#1A1A1A] ml-2">{rating} of 5 Stars</span>
            </div>
          </div>

          {/* Constructive Feedback (Visible to Candidate) */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Candidate Feedback (Shared with Candidate)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Highlight what impressed you about their code, testing, or architecture, or suggest constructive areas for improvement..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
          </div>

          {/* Private Recruiter Notes (NEVER visible to Candidate) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                Internal Recruiter Notes
              </label>
              <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                <Lock className="w-3 h-3" /> Private to hiring team
              </span>
            </div>
            <textarea
              rows={3}
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Private team notes: salary range expectation, team placement, seniority level match..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-[#FFFDF5]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEvaluationModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingEval}
              className="px-6 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition shadow-xs disabled:opacity-50"
            >
              {submittingEval ? 'Saving Decision...' : 'Save Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApplicantManagement;
