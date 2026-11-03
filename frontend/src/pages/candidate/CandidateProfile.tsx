import React, { useEffect, useState } from 'react';
import { profilesApi } from '../../api/profiles';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import SkillTagInput from '../../components/SkillTagInput';
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Globe,
  Code2,
  Share2,
  FileText,
  Save,
  Sparkles,
} from 'lucide-react';

export const CandidateProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await profilesApi.getCandidateProfile();
        setFullName(data.user?.full_name || user?.full_name || '');
        setHeadline(data.headline || '');
        setBio(data.bio || '');
        setSkills(data.skills || '');
        setEducation(data.education || '');
        setExperience(data.experience || '');
        setPortfolioUrl(data.portfolio_url || '');
        setGithubUrl(data.github_url || '');
        setLinkedinUrl(data.linkedin_url || '');
        setResumeUrl(data.resume_url || '');
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await profilesApi.updateCandidateProfile({
        full_name: fullName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        skills: skills.trim(),
        education: education.trim(),
        experience: experience.trim(),
        portfolio_url: portfolioUrl.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        resume_url: resumeUrl.trim(),
      });

      if (fullName.trim() && fullName.trim() !== user?.full_name) {
        updateUser({ full_name: fullName.trim() });
      }

      success('Profile updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="candidate" />

      <main className="flex-1 p-6 sm:p-10 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Candidate Profile
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Your profile is shared with recruiters when you submit task solutions.
            </p>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-40 bg-gray-100 rounded-xl"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-[#E5E7EB]">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFD600] flex items-center justify-center font-extrabold text-2xl text-[#1A1A1A] shadow-xs">
                    {fullName ? fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A]">{fullName || 'Candidate'}</h2>
                    <p className="text-xs text-[#6B7280]">{user?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#FFFDF5] border border-[#FFD600] text-[10px] font-bold text-[#1A1A1A]">
                      Candidate Verified
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Email Address (Account Login)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-gray-50 text-sm text-[#6B7280] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer | React, TypeScript & FastAPI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Bio & Engineering Philosophy
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell recruiters about your approach to building reliable software, your preferred tech stacks, and career interests..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <SkillTagInput
                    label="Core Technical Skills (Used for Match Calculations)"
                    helperText="Select or type your verified skills. Candidates with tagged skills get precision matched with recruiter tasks."
                    selectedSkills={skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : []}
                    onChange={(newSkills) => setSkills(newSkills.join(', '))}
                    placeholder="Search taxonomy (e.g. React, Python, Docker) or type custom..."
                  />
                </div>
              </div>

              {/* Experience & Education */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <h3 className="text-base font-bold text-[#1A1A1A]">Experience & Background</h3>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Work Experience
                  </label>
                  <textarea
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Company names, roles held, years, and high-impact achievements..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Education & Certifications
                  </label>
                  <textarea
                    rows={2}
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="Degree, major, university, graduation year..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Links & Portfolio Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#1A1A1A]">Online Presence & Repositories</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Portfolio / Personal Website
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourportfolio.dev"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      GitHub Profile URL
                    </label>
                    <div className="relative">
                      <Code2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/your-username"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      LinkedIn URL
                    </label>
                    <div className="relative">
                      <Share2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/your-profile"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Resume PDF Link
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://your-site.com/resume.pdf"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] font-bold text-sm text-[#1A1A1A] shadow-xs transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </main>
    </div>
  );
};

export default CandidateProfile;
