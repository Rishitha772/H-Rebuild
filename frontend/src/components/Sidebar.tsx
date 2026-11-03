import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  UserCheck,
  Building2,
  PlusCircle,
  Users,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  role: 'candidate' | 'recruiter';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Explore Tasks', icon: Compass },
    { to: '/candidate/applications', label: 'My Applications', icon: FileCheck2 },
    { to: '/candidate/profile', label: 'My Profile', icon: UserCheck },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/tasks', label: 'My Tasks', icon: Building2 },
    { to: '/recruiter/tasks/new', label: 'Create Task', icon: PlusCircle },
    { to: '/recruiter/applicants', label: 'Applicants', icon: Users },
    { to: '/recruiter/profile', label: 'Recruiter Profile', icon: UserCheck },
  ];

  const links = role === 'candidate' ? candidateLinks : recruiterLinks;

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] min-h-screen flex flex-col justify-between p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <Link
          to={role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
          className="flex items-center gap-2.5 pb-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFD600] flex items-center justify-center font-bold text-lg text-[#1A1A1A] shadow-sm transition group-hover:scale-105">
            H
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Hire</span>
            <span className="text-xl font-bold tracking-tight text-[#6B7280]">Sphere</span>
          </div>
        </Link>

        {/* User Card */}
        <div className="p-3.5 bg-[#FFFDF5] border border-[#FFD600]/40 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD600] flex items-center justify-center font-bold text-base text-[#1A1A1A] shrink-0">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-sm text-[#1A1A1A] truncate">
                {user?.full_name || 'User'}
              </h3>
              <span className="inline-block text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
                {role} Mode
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/recruiter/dashboard' || link.to === '/candidate/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FFD600] text-[#1A1A1A] shadow-sm font-semibold'
                      : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:text-red-600 hover:bg-red-50/50 transition"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

