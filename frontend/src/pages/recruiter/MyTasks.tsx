import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tasksApi } from '../../api/tasks';
import { useToast } from '../../context/ToastContext';
import { Task } from '../../types';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import DifficultyBadge from '../../components/DifficultyBadge';
import EmptyState from '../../components/EmptyState';
import {
  Building2,
  PlusCircle,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export const MyTasks: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks({ recruiter_only: true, page_size: 50 });
      setTasks(data.tasks);
    } catch (err) {
      console.error('Failed to load recruiter tasks', err);
      toastError('Could not load your tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDeleteTask = async (taskId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await tasksApi.deleteTask(taskId);
      success('Task deleted successfully');
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to delete task';
      toastError(msg);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'active' ? 'closed' : 'active';
    try {
      const updated = await tasksApi.updateTask(task.id, { status: newStatus });
      success(`Task is now ${newStatus}`);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      toastError('Failed to update task status');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="recruiter" />

      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                Manage Tasks
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                View, edit, toggle availability, or review applicants for your hiring challenges.
              </p>
            </div>
            <Link
              to="/recruiter/tasks/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-bold text-[#1A1A1A] shadow-xs transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Task
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse"></div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No hiring tasks found"
              description="You have not published any tasks yet. Create a challenge to begin receiving code submissions."
              actionText="Create Your First Task"
              onAction={() => window.location.assign('/recruiter/tasks/new')}
            />
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#FFD600] transition p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                      <DifficultyBadge difficulty={task.difficulty} />
                      <StatusBadge status={task.status} />
                    </div>

                    <Link
                      to={`/tasks/${task.id}`}
                      className="text-lg font-bold text-[#1A1A1A] hover:underline block leading-snug"
                    >
                      {task.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1 font-medium text-[#1A1A1A]">
                        <Users className="w-3.5 h-3.5 text-[#FFD600]" />
                        {task.application_count} {task.application_count === 1 ? 'applicant' : 'applicants'}
                      </span>
                      {task.compensation && (
                        <span>Stipend: {task.compensation}</span>
                      )}
                      <span>Openings: {task.openings}</span>
                      <span>
                        Deadline:{' '}
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString()
                          : 'Rolling'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        task.status === 'active'
                          ? 'bg-gray-100 text-[#6B7280] border-[#E5E7EB] hover:bg-gray-200'
                          : 'bg-[#FFD600]/20 text-[#1A1A1A] border-[#FFD600]'
                      }`}
                    >
                      {task.status === 'active' ? 'Mark Closed' : 'Reopen Task'}
                    </button>

                    <Link
                      to={`/recruiter/tasks/${task.id}/applicants`}
                      className="px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-xs font-bold text-[#1A1A1A] transition shadow-xs flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Applicants ({task.application_count})
                    </Link>

                    <Link
                      to={`/recruiter/tasks/${task.id}/edit`}
                      className="p-2 rounded-xl border border-[#E5E7EB] hover:border-black text-[#1A1A1A] transition"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteTask(task.id, task.title)}
                      className="p-2 rounded-xl border border-[#E5E7EB] hover:border-red-500 hover:text-red-600 text-gray-400 transition"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
    </div>
  );
};

export default MyTasks;

