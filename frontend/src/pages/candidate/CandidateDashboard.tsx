import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationsApi } from '../../api/applications';
import { profilesApi } from '../../api/profiles';
import { tasksApi } from '../../api/tasks';
import { Application, CandidateProfile, Task } from '../../types';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { calculateSkillMatch, parseSkills } from '../../utils/skillMatcher';
import {
  FileText,
  Clock,
  Trophy,
  ArrowRight,
  Compass,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [recommendedTasks, setRecommendedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [appsData, profileData, tasksData] = await Promise.all([
          applicationsApi.getMyApplications(),
          profilesApi.getCandidateProfile(),
          tasksApi.getTasks({ page: 1, page_size: 3, sort_by: 'newest' }),
        ]);
        setApplications(appsData);
        setProfile(profileData);
        setRecommendedTasks(tasksData.tasks);
      } catch (err) {
        console.error('Failed to load candidate dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 30;
    let score = 20; // user account exists
    if (profile.headline) score += 15;
    if (profile.bio) score += 15;
    if (profile.skills) score += 20;
    if (profile.portfolio_url || profile.github_url) score += 15;
    if (profile.experience || profile.education) score += 15;
    return Math.min(score, 100);
  };

  const completion = calculateProfileCompletion();

  // Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) =>
    ['Applied', 'Submitted', 'Under Review'].includes(a.status)
  ).length;
  const shortlistedApps = applications.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="candidate" />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                Welcome back, {user?.full_name?.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Track your active task submissions and discover new practical opportunities.
              </p>
            </div>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-bold text-[#1A1A1A] shadow-xs transition self-start sm:self-auto"
            >
              <Compass className="w-4 h-4" />
              Explore Open Tasks
            </Link>
          </div>

          {/* Profile Completion Bar */}
          {completion < 100 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    Profile Strength: {completion}%
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    Complete profile to impress recruiters
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#FFD600] rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>
              <Link
                to="/candidate/profile"
                className="text-xs font-bold text-[#1A1A1A] hover:underline whitespace-nowrap self-end sm:self-auto"
              >
                Complete Profile →
              </Link>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Total Applications */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Total Applications
                </span>
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-[#1A1A1A]">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{totalApps}</p>
              <p className="text-xs text-[#6B7280] mt-1">Across all practical challenges</p>
            </div>

            {/* Pending / In Review */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  In Review
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFFDF5] border border-[#FFD600]/40 flex items-center justify-center text-[#1A1A1A]">
                  <Clock className="w-4 h-4 text-[#1A1A1A]" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{pendingApps}</p>
              <p className="text-xs text-[#6B7280] mt-1">Awaiting recruiter evaluation</p>
            </div>

            {/* Shortlisted */}
            <div className="bg-white rounded-2xl border border-[#FFD600] p-6 shadow-xs bg-[#FFFDF5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Shortlisted
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFD600] flex items-center justify-center text-[#1A1A1A]">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#1A1A1A]">{shortlistedApps}</p>
              <p className="text-xs text-[#6B7280] mt-1">Direct interview invites</p>
            </div>
          </div>

          {/* Recent Application Activity */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Applications</h2>
              <Link
                to="/candidate/applications"
                className="text-xs font-bold text-[#1A1A1A] hover:underline"
              >
                View all applications ({applications.length}) →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-white border border-[#E5E7EB] rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Explore open engineering tasks, complete a challenge, and demonstrate your capability."
                actionText="Explore Open Tasks"
                onAction={() => {}}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] shadow-xs overflow-hidden">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          to={`/tasks/${app.task_id}`}
                          className="font-bold text-sm text-[#1A1A1A] hover:underline"
                        >
                          {app.task?.title}
                        </Link>
                        <span className="text-xs text-[#6B7280]">
                          • {app.task?.recruiter_company}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                        {app.submission && (
                          <span className="text-black font-medium">✓ Solution Submitted</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <Link
                        to="/candidate/applications"
                        className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-black text-xs font-semibold text-[#1A1A1A] transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Hiring Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Recommended Hiring Tasks</h2>
              <Link to="/tasks" className="text-xs font-bold text-[#1A1A1A] hover:underline">
                View all tasks →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedTasks.map((t) => {
                const candidateSkills = profile?.skills ? parseSkills(profile.skills) : [];
                const match = candidateSkills.length > 0 ? calculateSkillMatch(candidateSkills, parseSkills(t.required_skills)) : null;

                return (
                  <div key={t.id} className="p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FFD600] transition shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                        {match && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-[#FFD600] px-2 py-0.5 rounded-full shadow-xs">
                            <Sparkles className="w-3 h-3 text-black" />
                            {match.matchPercentage}% match
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[#1A1A1A] mt-2 mb-1 line-clamp-1">
                        {t.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">
                        {t.description}
                      </p>
                    </div>
                    <Link
                      to={`/tasks/${t.id}`}
                      className="w-full text-center py-2 rounded-xl bg-gray-50 hover:bg-[#FFD600] text-xs font-bold text-[#1A1A1A] transition border border-[#E5E7EB]"
                    >
                      View Task Details
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
    </div>
  );
};

export default CandidateDashboard;

