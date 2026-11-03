import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tasksApi } from '../../api/tasks';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import SkillTagInput from '../../components/SkillTagInput';
import { Save, ArrowLeft } from 'lucide-react';

export const CreateEditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const taskId = Number(id);

  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Backend');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [instructions, setInstructions] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [deadline, setDeadline] = useState('');
  const [compensation, setCompensation] = useState('');
  const [openings, setOpenings] = useState(1);
  const [status, setStatus] = useState<'active' | 'closed' | 'draft'>('active');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const loadTask = async () => {
        try {
          const data = await tasksApi.getTaskById(taskId);
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setRequiredSkills(data.required_skills || '');
          setDifficulty(data.difficulty);
          setInstructions(data.instructions);
          setDeliverables(data.deliverables);
          setCompensation(data.compensation || '');
          setOpenings(data.openings || 1);
          setStatus(data.status);
          if (data.deadline) {
            setDeadline(new Date(data.deadline).toISOString().split('T')[0]);
          }
        } catch (err) {
          toastError('Failed to load task details');
          navigate('/recruiter/tasks');
        } finally {
          setLoading(false);
        }
      };
      loadTask();
    }
  }, [isEditing, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !instructions.trim() || !deliverables.trim()) {
      toastError('Please complete all required fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        required_skills: requiredSkills.trim() || undefined,
        difficulty,
        instructions: instructions.trim(),
        deliverables: deliverables.trim(),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        compensation: compensation.trim() || undefined,
        openings: Number(openings) || 1,
        status,
      };

      if (isEditing) {
        await tasksApi.updateTask(taskId, payload);
        success('Hiring task updated successfully!');
      } else {
        await tasksApi.createTask(payload);
        success('Hiring task published successfully!');
      }
      navigate('/recruiter/tasks');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save task';
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="recruiter" />

      <main className="flex-1 p-6 sm:p-10 max-w-4xl">
          <Link
            to="/recruiter/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to my tasks
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {isEditing ? 'Edit Hiring Task' : 'Create New Hiring Task'}
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Specify the deliverables, instructions, and skills needed so candidates can demonstrate their expertise.
            </p>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-100 rounded-xl"></div>
              <div className="h-32 bg-gray-100 rounded-xl"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Core Information Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <h2 className="text-base font-bold text-[#1A1A1A] pb-2 border-b border-[#E5E7EB]">
                  1. Basic Details
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build an Idempotent Webhook Delivery Worker"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Engineering Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                    >
                      <option value="Frontend">Frontend Engineering</option>
                      <option value="Backend">Backend Systems</option>
                      <option value="Fullstack">Fullstack Architecture</option>
                      <option value="Design">UI/UX & Product Design</option>
                      <option value="Data & AI">Data & Artificial Intelligence</option>
                      <option value="DevOps">DevOps & Cloud Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Difficulty Level *
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                    >
                      <option value="Beginner">Beginner (1-2 years experience)</option>
                      <option value="Intermediate">Intermediate (3-5 years experience)</option>
                      <option value="Advanced">Advanced (Senior / Staff level)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <SkillTagInput
                    label="Required Skills *"
                    helperText="Tag the primary skills needed for this challenge. Used to calculate match scores for prospective candidates."
                    selectedSkills={requiredSkills ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean) : []}
                    onChange={(skills) => setRequiredSkills(skills.join(', '))}
                    placeholder="Search taxonomy (e.g. Python, FastAPI, Redis)..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Task Summary / Overview *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="High-level description of what the candidate is solving and why it matters..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                  />
                </div>
              </div>

              {/* Instructions & Deliverables Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <h2 className="text-base font-bold text-[#1A1A1A] pb-2 border-b border-[#E5E7EB]">
                  2. Requirements & Deliverables
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Step-by-Step Task Instructions *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="1. Build an endpoint that accepts X...&#10;2. Implement queuing worker with Y...&#10;3. Write integration tests..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-mono text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Expected Deliverables *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={deliverables}
                    onChange={(e) => setDeliverables(e.target.value)}
                    placeholder="e.g. Public GitHub repository with README, docker-compose.yml, architecture diagram, and test coverage report."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                  />
                </div>
              </div>

              {/* Terms & Availability Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <h2 className="text-base font-bold text-[#1A1A1A] pb-2 border-b border-[#E5E7EB]">
                  3. Compensation & Availability
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Compensation / Stipend
                    </label>
                    <input
                      type="text"
                      value={compensation}
                      onChange={(e) => setCompensation(e.target.value)}
                      placeholder="e.g. $1,800 + Fast-track"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Number of Openings *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={openings}
                      onChange={(e) => setOpenings(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Submission Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Task Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                  >
                    <option value="active">Active (Visible & Open for submissions)</option>
                    <option value="closed">Closed (No longer accepting submissions)</option>
                    <option value="draft">Draft (Hidden from candidates)</option>
                  </select>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3">
                <Link
                  to="/recruiter/tasks"
                  className="px-5 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#1A1A1A] bg-white hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] font-bold text-sm text-[#1A1A1A] shadow-xs transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : isEditing ? 'Update Task' : 'Publish Task'}
                </button>
              </div>
            </form>
          )}
        </main>
    </div>
  );
};

export default CreateEditTask;

