import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, Briefcase, GraduationCap } from 'lucide-react';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const { user, isAuthenticated, register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'candidate';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please complete all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });

      success(`Account created! Welcome to HireSphere, ${user.full_name}.`);

      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Registration failed. Please check your info.';
      setErrorMsg(detail);
      toastError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD600] flex items-center justify-center font-bold text-xl text-[#1A1A1A] mx-auto mb-4">
              H
            </div>
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              Join HireSphere
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Select your role to get started
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FFFDF5] border border-[#E5E7EB] rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'candidate'
                  ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#FFD600]'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#FFD600]" />
              I'm a Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'recruiter'
                  ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#FFD600]'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#FFD600]" />
              I'm a Recruiter
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-black text-sm text-[#1A1A1A] bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-[#E5E7EB] text-xs text-[#6B7280]">
              Signing up as a <strong className="text-[#1A1A1A] capitalize">{role}</strong> allows you to{' '}
              {role === 'candidate'
                ? 'solve hiring tasks, submit repositories, and get shortlisted for interviews.'
                : 'publish real-world tasks, review candidate code submissions, and hire top talent.'}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-bold text-[#1A1A1A] shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Creating account...' : `Sign Up as ${role === 'candidate' ? 'Candidate' : 'Recruiter'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6B7280]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#1A1A1A] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;

