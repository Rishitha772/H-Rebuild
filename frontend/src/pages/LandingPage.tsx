import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ValueStrip from '../components/ValueStrip';
import ProblemSolution from '../components/ProblemSolution';
import InteractiveExplorer from '../components/InteractiveExplorer';
import HowItWorksDetailed from '../components/HowItWorksDetailed';
import CoreFeatures from '../components/CoreFeatures';
import AboutUs from '../components/AboutUs';
import FounderSection from '../components/FounderSection';
import {
  ArrowRight,
  CheckCircle,
  FileCode,
  Sparkles,
  Users2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [featuredTasks, setFeaturedTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await tasksApi.getTasks({ page: 1, page_size: 3 });
        setFeaturedTasks(data.tasks);
      } catch (err) {
        console.error('Failed to load featured tasks', err);
      } finally {
        setLoadingTasks(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1A1A1A] flex flex-col selection:bg-[#FFD600]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-20 md:pt-28 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FFD600] text-xs font-bold text-[#1A1A1A] mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
          <span>The Next-Generation Task-Based Hiring Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1A1A1A] max-w-4xl mx-auto leading-[1.1] mb-6">
          Your Skills Deserve More Than a Resume.
        </h1>

        <p className="text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Discover opportunities where your skills speak through real-world tasks.
          Connect with recruiters, showcase your work, and move closer to your next opportunity.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/tasks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-base font-bold text-[#1A1A1A] shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Explore Opportunities
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register?role=recruiter"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-[#E5E7EB] hover:border-[#1A1A1A] text-base font-semibold text-[#1A1A1A] transition"
          >
            Hire Through Tasks
          </Link>
        </div>

        {/* Minimal Credibility Line */}
        <div className="mt-16 pt-8 border-t border-[#E5E7EB] flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-[#6B7280]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#FFD600]" />
            <span>Verified practical challenges</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#FFD600]" />
            <span>Guaranteed recruiter evaluations</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#FFD600]" />
            <span>Stipend & direct interview fast-track</span>
          </div>
        </div>
      </section>

      {/* Value Strip: 4 Core Pillars */}
      <ValueStrip />

      {/* Problem & Solution Comparison */}
      <ProblemSolution />

      {/* Interactive ROI Impact & Advantage Simulator */}
      <InteractiveExplorer />

      {/* How HireSphere Works (8 Candidate Steps & 8 Recruiter Steps) */}
      <HowItWorksDetailed />

      {/* 10 Core Features */}
      <CoreFeatures />

      {/* Featured Tasks (Live from API) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#6B7280] mb-2">Explore</h2>
            <p className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Featured Hiring Tasks
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              Active engineering challenges currently accepting submissions.
            </p>
          </div>
          <Link
            to="/tasks"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] hover:underline"
          >
            Browse all tasks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingTasks ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white border border-[#E5E7EB] animate-pulse"></div>
            ))}
          </div>
        ) : featuredTasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-[#E5E7EB]">
            <p className="text-sm font-bold text-[#1A1A1A]">No tasks published yet</p>
            <p className="text-xs text-[#6B7280] mt-1 mb-4">Be the first recruiter to post a hiring challenge!</p>
            <Link
              to="/register?role=recruiter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] font-bold text-xs text-[#1A1A1A]"
            >
              Post a Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* Dual Role Value Proposition */}
      <section id="for-recruiters" className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Candidate Benefits */}
            <div className="p-8 rounded-3xl border border-[#E5E7EB] bg-[#FFFDF5]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#1A1A1A] mb-4">
                <FileCode className="w-3.5 h-3.5 text-[#FFD600]" />
                <span>For Candidates</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Let your code speak louder than pedigree.
              </h3>
              <ul className="space-y-3.5 text-sm text-[#6B7280]">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>No more automatic AI resume rejections based on keywords.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Get paid task stipends while interviewing with top teams.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Receive transparent ratings and actionable recruiter feedback.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/register?role=candidate"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-sm font-semibold transition"
                >
                  Join as Candidate
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Recruiter Benefits */}
            <div className="p-8 rounded-3xl border border-[#E5E7EB] bg-[#FFFDF5]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#1A1A1A] mb-4">
                <Users2 className="w-3.5 h-3.5 text-[#FFD600]" />
                <span>For Recruiters</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Filter for builders, not resume polishers.
              </h3>
              <ul className="space-y-3.5 text-sm text-[#6B7280]">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Evaluate working prototypes, clean code, and engineering decisions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Eliminate 80% of unqualified first-round screening calls.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <span>Private notes and structured scoring rubrics for hiring teams.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/register?role=recruiter"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-[#1A1A1A] text-sm font-semibold transition shadow-xs"
                >
                  Post a Hiring Task
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us & Platform Philosophy */}
      <AboutUs />

      {/* Founder Spotlight: Rishitha Khandesh */}
      <FounderSection />

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-white border border-[#FFD600] shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            Ready to change the way you hire and get hired?
          </h2>
          <p className="text-base text-[#6B7280] max-w-xl mx-auto mb-8">
            Join candidates and engineering managers proving real-world value through practical tasks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-base font-bold text-[#1A1A1A] shadow-sm transition"
            >
              Get Started for Free
            </Link>
            <Link
              to="/tasks"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#E5E7EB] hover:border-black text-base font-semibold text-[#1A1A1A] bg-white transition"
            >
              Browse Open Tasks
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
