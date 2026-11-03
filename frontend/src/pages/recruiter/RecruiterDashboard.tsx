import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profilesApi } from '../../api/profiles';
import { tasksApi } from '../../api/tasks';
import { RecruiterStats, Task } from '../../types';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import {
  Building2,
  Users,
  Clock,
  Trophy,
  PlusCircle,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<RecruiterStats>({
    total_active_tasks: 0,
    total_tasks: 0,
    total_applicants: 0,
    submissions_awaiting_review: 0,
    shortlisted_candidates: 0,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [statsData, tasksData] = await Promise.all([
          profilesApi.getRecruiterStats(),
          tasksApi.getTasks({ recruiter_only: true, page: 1, page_size: 5 }),
        ]);
        setStats(statsData);
        setTasks(tasksData.tasks);
      } catch (err) {
        console.error('Failed to load recruiter dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="recruiter" />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Manage your task-based hiring pipeline and review candidate deliverables.
              </p>
            </div>
            <Link
              to="/recruiter/tasks/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-bold text-[#1A1A1A] shadow-xs transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              Create Hiring Task
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {/* Active Tasks */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Active Tasks
                </span>
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#1A1A1A]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{stats.total_active_tasks}</p>
              <p className="text-xs text-[#6B7280] mt-1">
                {stats.total_tasks} total published
              </p>
            </div>

            {/* Total Applicants */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Total Candidates
                </span>
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#1A1A1A]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{stats.total_applicants}</p>
              <p className="text-xs text-[#6B7280] mt-1">Applied across your tasks</p>
            </div>

            {/* Awaiting Review */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Awaiting Review
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFFDF5] border border-[#FFD600]/40 flex items-center justify-center text-[#1A1A1A]">
                  <Clock className="w-4 h-4 text-[#1A1A1A]" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{stats.submissions_awaiting_review}</p>
              <p className="text-xs text-[#6B7280] mt-1">Submissions need scoring</p>
            </div>

            {/* Shortlisted */}
            <div className="bg-white rounded-2xl border border-[#FFD600] p-5 shadow-xs bg-[#FFFDF5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Shortlisted
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFD600] flex items-center justify-center text-[#1A1A1A]">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{stats.shortlisted_candidates}</p>
              <p className="text-xs text-[#6B7280] mt-1">Interview fast-tracked</p>
            </div>
          </div>

          {/* Recruiter Tasks Overview */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Your Hiring Tasks</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">Tasks you've created and their applicant metrics</p>
              </div>
              <Link
                to="/recruiter/tasks"
                className="text-xs font-bold text-[#1A1A1A] hover:underline"
              >
                Manage all tasks →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No tasks created yet"
                description="Start hiring through practical challenges. Post your first hiring task to attract skilled developers."
                actionText="Create Hiring Task"
                onAction={() => window.location.assign('/recruiter/tasks/new')}
              />
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {tasks.map((t) => (
                  <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                        <StatusBadge status={t.status} />
                        <span className="text-xs text-[#6B7280]">
                          • {t.openings} {t.openings === 1 ? 'opening' : 'openings'}
                        </span>
                      </div>
                      <Link
                        to={`/tasks/${t.id}`}
                        className="font-bold text-sm text-[#1A1A1A] hover:underline block"
                      >
                        {t.title}
                      </Link>
                      <p className="text-xs text-[#6B7280]">
                        Created on {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right mr-2 hidden sm:block">
                        <p className="text-xs font-bold text-[#1A1A1A]">
                          {t.application_count} {t.application_count === 1 ? 'applicant' : 'applicants'}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">Click to evaluate</p>
                      </div>

                      <Link
                        to={`/recruiter/tasks/${t.id}/applicants`}
                        className="px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition shadow-xs flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Applicants ({t.application_count})
                      </Link>

                      <Link
                        to={`/recruiter/tasks/${t.id}/edit`}
                        className="p-2 rounded-xl border border-[#E5E7EB] hover:border-black text-[#1A1A1A] transition"
                        title="Edit Task"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default RecruiterDashboard;

