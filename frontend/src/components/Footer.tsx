import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-sm text-[#6B7280]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFD600] flex items-center justify-center font-bold text-sm text-[#1A1A1A]">
                H
              </div>
              <span className="font-bold tracking-tight text-[#1A1A1A]">HireSphere</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Task-based hiring where real-world skill and practical deliverables replace resume screening.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tasks" className="hover:text-black transition">Explore Tasks</Link></li>
              <li><a href="/#how-it-works" className="hover:text-black transition">How It Works</a></li>
              <li><Link to="/register?role=candidate" className="hover:text-black transition">For Candidates</Link></li>
              <li><Link to="/register?role=recruiter" className="hover:text-black transition">For Recruiters</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tasks?category=Frontend" className="hover:text-black transition">Frontend Engineering</Link></li>
              <li><Link to="/tasks?category=Backend" className="hover:text-black transition">Backend Systems</Link></li>
              <li><Link to="/tasks?category=Fullstack" className="hover:text-black transition">Full-Stack Architecture</Link></li>
              <li><Link to="/tasks?category=Design" className="hover:text-black transition">UI/UX & Product Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">Philosophy</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              No endless automated ATS rejections. Just honest tasks, transparent compensation, and merit-based shortlisting.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} HireSphere. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-black transition">Terms of Service</a>
            <a href="#" className="hover:text-black transition">Privacy Policy</a>
            <a href="#" className="hover:text-black transition">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

