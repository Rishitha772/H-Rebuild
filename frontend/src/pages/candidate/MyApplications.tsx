import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../../api/applications';
import { useToast } from '../../context/ToastContext';
import { Application } from '../../types';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import {
  FileText,
  Star,
  ExternalLink,
  Edit3,
  Calendar,
  DollarSign,
  ArrowRight,
  Send,
  MessageSquare,
  Building,
} from 'lucide-react';

export const MyApplications: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit / Add Submission Modal state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [savingSubmission, setSavingSubmission] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsApi.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
      toastError('Could not fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const openSubmissionModal = (app: Application) => {
    setSelectedApp(app);
    setSubmissionUrl(app.submission?.submission_url || '');
    setDescription(app.submission?.description || '');
    setAttachmentUrl(app.submission?.attachment_url || '');
    setSubmissionModalOpen(true);
  };

  const handleSaveSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    if (!submissionUrl.trim() || !description.trim()) {
      toastError('Please provide both a submission URL and a description of your work.');
      return;
    }

    setSavingSubmission(true);
    try {
      if (selectedApp.submission) {
        await applicationsApi.updateSubmission(selectedApp.id, {
          submission_url: submissionUrl.trim(),
          description: description.trim(),
          attachment_url: attachmentUrl.trim() || undefined,
        });
        success('Submission solution updated successfully!');
      } else {
        await applicationsApi.submitSolution(selectedApp.id, {
          submission_url: submissionUrl.trim(),
          description: description.trim(),
          attachment_url: attachmentUrl.trim() || undefined,
        });
        success('Solution submitted for evaluation!');
      }
      setSubmissionModalOpen(false);
      loadApplications();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit solution';
      toastError(msg);
    } finally {
      setSavingSubmission(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="candidate" />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                My Applications
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Monitor evaluation states, view recruiter feedback, and submit your practical solutions.
              </p>
            </div>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-bold text-[#1A1A1A] shadow-xs transition self-start sm:self-auto"
            >
              Browse More Tasks
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse"></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="You haven't applied to any practical hiring challenges yet. Discover active tasks and showcase your skills."
              actionText="Explore Open Tasks"
              onAction={() => window.location.assign('/tasks')}
            />
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#FFD600] transition p-6 shadow-xs flex flex-col gap-6"
                >
                  {/* Top Bar: Title, Company, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-gray-100 px-2.5 py-0.5 rounded">
                          {app.task?.category}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>

                      <Link
                        to={`/tasks/${app.task_id}`}
                        className="text-lg font-bold text-[#1A1A1A] hover:underline"
                      >
                        {app.task?.title}
                      </Link>

                      <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-1">
                        <span className="flex items-center gap-1 font-medium text-[#1A1A1A]">
                          <Building className="w-3.5 h-3.5 text-[#1A1A1A]" />
                          {app.task?.recruiter_company}
                        </span>
                        <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                        {app.task?.compensation && (
                          <span>Stipend: {app.task.compensation}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Link
                        to={`/tasks/${app.task_id}`}
                        className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#1A1A1A] bg-white transition"
                      >
                        Task Specs
                      </Link>

                      {app.status !== 'Shortlisted' && app.status !== 'Rejected' && (
                        <button
                          onClick={() => openSubmissionModal(app)}
                          className="px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition shadow-xs flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          {app.submission ? 'Update Submission' : 'Submit Solution'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submission Details Card (if submitted) */}
                  {app.submission ? (
                    <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E5E7EB] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                          Your Submitted Solution
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          Submitted {new Date(app.submission.submitted_at || '').toLocaleDateString()}
                        </span>
                      </div>

                      <a
                        href={app.submission.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A1A] hover:underline"
                      >
                        {app.submission.submission_url}
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <p className="text-xs text-[#6B7280] leading-relaxed whitespace-pre-line pt-1">
                        {app.submission.description}
                      </p>

                      {app.submission.attachment_url && (
                        <div className="pt-1">
                          <a
                            href={app.submission.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#6B7280] hover:text-[#1A1A1A] underline"
                          >
                            Demo / Documentation Link ↗
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
                      <p>No solution submitted yet. Complete the challenge and upload your repository link.</p>
                      <button
                        onClick={() => openSubmissionModal(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] text-white font-semibold hover:bg-black transition whitespace-nowrap"
                      >
                        Submit Now
                      </button>
                    </div>
                  )}

                  {/* Recruiter Evaluation & Feedback (if evaluated) */}
                  {app.evaluation && (
                    <div className="p-5 rounded-2xl bg-white border-2 border-[#FFD600] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                            Recruiter Evaluation
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFD600] text-[#1A1A1A]">
                            Decision: {app.evaluation.decision}
                          </span>
                        </div>

                        {/* Rating stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= app.evaluation!.rating
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
                        <div className="p-3.5 bg-[#FFFDF5] rounded-xl border border-[#E5E7EB] text-xs text-[#1A1A1A] leading-relaxed">
                          <div className="flex items-center gap-1.5 font-bold mb-1 text-[#1A1A1A]">
                            <MessageSquare className="w-3.5 h-3.5 text-[#FFD600]" />
                            Feedback from Hiring Team:
                          </div>
                          {app.evaluation.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modal for Submitting or Updating Solution */}
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        title={selectedApp?.submission ? 'Update Solution' : 'Submit Task Solution'}
        subtitle={selectedApp?.task?.title}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveSubmission} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Solution Repository or Deliverable URL *
            </label>
            <input
              type="url"
              required
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/your-username/task-solution"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
            <p className="text-[11px] text-[#6B7280] mt-1">
              GitHub repository, Figma design file, or hosted sandbox.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Implementation Overview & Architecture Notes *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how you solved the challenge, technical architecture, tradeoffs, and testing results..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              Optional Live Demo URL / Video Walkthrough
            </label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://my-demo-app.vercel.app or Loom URL"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubmissionModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#1A1A1A] hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingSubmission}
              className="px-6 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition shadow-xs disabled:opacity-50"
            >
              {savingSubmission ? 'Submitting...' : 'Save & Submit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyApplications;
