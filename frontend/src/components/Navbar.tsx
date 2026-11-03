import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#FFD600] flex items-center justify-center font-bold text-lg text-[#1A1A1A] shadow-sm transition group-hover:scale-105">
              H
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Hire</span>
              <span className="text-xl font-bold tracking-tight text-[#6B7280]">Sphere</span>
            </div>
          </Link>

          {/* Desktop Nav Links - Always seen before signup & across public pages */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1A1A1A]">
            <Link to="/tasks" className="hover:text-black transition">
              Explore Tasks
            </Link>
            <a href="/#how-it-works" className="hover:text-black transition">
              How It Works
            </a>
            <a href="/#founder" className="hover:text-black transition flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]"></span>
              Leadership
            </a>
            <a href="/#about-us" className="hover:text-black transition">
              Philosophy
            </a>
            <a href="/#for-recruiters" className="hover:text-black transition">
              For Recruiters
            </a>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-black text-sm font-medium text-[#1A1A1A] bg-white transition"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFD600]"></span>
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#1A1A1A] leading-tight">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] capitalize text-[#6B7280]">
                      {user.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:text-black transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-semibold text-[#1A1A1A] shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/tasks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#1A1A1A]"
          >
            Explore Tasks
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#1A1A1A]"
          >
            How It Works
          </a>
          <a
            href="/#founder"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#1A1A1A]"
          >
            Leadership (Founder)
          </a>
          <a
            href="/#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#1A1A1A]"
          >
            Philosophy
          </a>
          <a
            href="/#for-recruiters"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#1A1A1A]"
          >
            For Recruiters
          </a>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#FFD600] font-semibold text-sm text-[#1A1A1A]"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-sm text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#1A1A1A]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#FFD600] text-sm font-semibold text-[#1A1A1A]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

