import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname;

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
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email, password });
      success(`Welcome back, ${user.full_name}!`);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Invalid email or password. Please try again.';
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
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD600] flex items-center justify-center font-bold text-xl text-[#1A1A1A] mx-auto mb-4">
              H
            </div>
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              Sign in to HireSphere
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Access your task-based opportunities & evaluations
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@example.com"
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
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-bold text-[#1A1A1A] shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6B7280]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#1A1A1A] hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

