import React, { useEffect, useState } from 'react';
import { profilesApi } from '../../api/profiles';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import { Building, Globe, Image, Briefcase, Mail, Save, User } from 'lucide-react';

export const RecruiterProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [designation, setDesignation] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await profilesApi.getRecruiterProfile();
        setFullName(data.user?.full_name || user?.full_name || '');
        setCompanyName(data.company_name || '');
        setCompanyDescription(data.company_description || '');
        setCompanyWebsite(data.company_website || '');
        setCompanyLogo(data.company_logo || '');
        setDesignation(data.designation || '');
      } catch (err) {
        console.error('Failed to load recruiter profile', err);
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
      await profilesApi.updateRecruiterProfile({
        full_name: fullName.trim(),
        company_name: companyName.trim(),
        company_description: companyDescription.trim(),
        company_website: companyWebsite.trim(),
        company_logo: companyLogo.trim(),
        designation: designation.trim(),
      });

      if (fullName.trim() && fullName.trim() !== user?.full_name) {
        updateUser({ full_name: fullName.trim() });
      }

      success('Recruiter profile updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to update recruiter profile';
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex selection:bg-[#FFD600]">
      <Sidebar role="recruiter" />

      <main className="flex-1 p-6 sm:p-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Recruiter & Company Profile
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Your company branding and verified recruiter credentials shown on published tasks.
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
              {/* Recruiter Identity Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-[#E5E7EB]">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="w-16 h-16 rounded-2xl object-cover border border-[#E5E7EB]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#FFD600] flex items-center justify-center font-extrabold text-2xl text-[#1A1A1A] shadow-xs">
                      {companyName ? companyName[0].toUpperCase() : 'C'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      {companyName || 'Your Organization'}
                    </h2>
                    <p className="text-xs text-[#6B7280]">
                      {designation ? `${designation} • ` : ''}
                      {fullName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Account Email
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
                    Your Title / Role
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Head of Engineering, Senior Tech Recruiter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                  />
                </div>
              </div>

              {/* Company Information Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs space-y-6">
                <h3 className="text-base font-bold text-[#1A1A1A] pb-2 border-b border-[#E5E7EB]">
                  Company Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Cloud Architectures"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                      Company Website URL
                    </label>
                    <input
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={companyLogo}
                    onChange={(e) => setCompanyLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                  />
                  <p className="text-[11px] text-[#6B7280] mt-1">Direct image URL (JPG, PNG, SVG)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                    Company Description & Mission
                  </label>
                  <textarea
                    rows={4}
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="What does your company build, what is your engineering culture, and why should top builders join you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                  />
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
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </main>
    </div>
  );
};

export default RecruiterProfile;

