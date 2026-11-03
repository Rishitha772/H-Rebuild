import React, { useState } from 'react';
import {
  UserCheck,
  Compass,
  FileText,
  Code2,
  UploadCloud,
  CheckSquare,
  Award,
  Users,
  Building2,
  PlusCircle,
  Sliders,
  Inbox,
  Eye,
  BarChart2,
  CheckCheck,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksDetailed: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'candidate' | 'recruiter'>('candidate');
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const candidateSteps = [
    {
      step: 1,
      title: 'Browse Practical Challenges',
      desc: 'Explore real-world challenges created by engineering teams across Frontend, Backend, AI, and Design.',
      detail: 'Filter by tech stack, difficulty, and compensation stipend.',
    },
    {
      step: 2,
      title: 'Review Task Specifications',
      desc: 'Review exact instructions, required deliverables, architectural constraints, and grading criteria upfront.',
      detail: 'No hidden expectations or ambiguous puzzle prompts.',
    },
    {
      step: 3,
      title: 'Match Your Verified Skills',
      desc: 'See instantaneous skill match calculations between your profile and the task requirements.',
      detail: 'Understand your strengths and skill coverage before you begin.',
    },
    {
      step: 4,
      title: 'Build in Your Preferred Environment',
      desc: 'Code with your favorite IDE, linters, packages, and local testing frameworks at your own pace.',
      detail: 'True to real-world engineering rather than artificial timed whiteboard pressure.',
    },
    {
      step: 5,
      title: 'Submit Production Deliverables',
      desc: 'Submit your GitHub repository link, live demo deployment, and architectural rationale notes.',
      detail: 'Complete freedom to demonstrate edge-case coverage and documentation hygiene.',
    },
    {
      step: 6,
      title: 'Transparent Rubric Scoring',
      desc: 'Hiring managers evaluate code readability, modularity, and test suites against structured rubrics.',
      detail: 'Objective scoring eliminates pedigree bias and university brand filtering.',
    },
    {
      step: 7,
      title: 'Actionable Recruiter Feedback',
      desc: 'Receive transparent 1-5 star ratings and constructive feedback comments directly from the hiring team.',
      detail: 'No automated generic rejection emails.',
    },
    {
      step: 8,
      title: 'Direct Interview Shortlisting',
      desc: 'Top performers bypass preliminary screening entirely and move straight into senior team interviews.',
      detail: 'Fast-track to offer stage with verified technical capability already established.',
    },
  ];

  const recruiterSteps = [
    {
      step: 1,
      title: 'Define Real Engineering Challenge',
      desc: 'Create hiring challenges modeled directly on the problems your engineering squad solves every sprint.',
      detail: 'Replace trivia quizzes with high-signal practical tasks.',
    },
    {
      step: 2,
      title: 'Set Evaluation Rubrics',
      desc: 'Define clear expectations for architecture, test coverage, code clarity, and deliverables.',
      detail: 'Align the hiring panel around objective evaluation standards.',
    },
    {
      step: 3,
      title: 'Publish with Taxonomy Skill Tags',
      desc: 'Tag required skills, difficulty levels, deadlines, and completion stipends to attract top builders.',
      detail: 'Automatically match with skilled developers across the platform.',
    },
    {
      step: 4,
      title: 'Receive Verified Submissions',
      desc: 'Candidates submit functioning codebases, live preview URLs, and technical documentation.',
      detail: 'No resume guessing—review working software.',
    },
    {
      step: 5,
      title: 'Inspect Live Demos & Repositories',
      desc: 'Review candidates’ Git commit history, code structure, component modularity, and error handling.',
      detail: 'Observe candidate craft in real-world conditions.',
    },
    {
      step: 6,
      title: 'Score with Private Notes',
      desc: 'Assign 1-5 star ratings, write candidate-visible feedback, and record confidential hiring team notes.',
      detail: 'Complete private separation guarantees internal notes remain secure.',
    },
    {
      step: 7,
      title: 'Direct Shortlist for Interviews',
      desc: 'Shortlist top performers with one click to trigger final round technical discussions.',
      detail: 'Compress hiring cycles from 5 weeks down to 7 days.',
    },
    {
      step: 8,
      title: 'Hire Proven Builders',
      desc: 'Extend offers with total confidence that new hires will hit the ground running on day one.',
      detail: 'Drastically minimize probationary mismatches.',
    },
  ];

  const steps = activeWorkflow === 'candidate' ? candidateSteps : recruiterSteps;
  const currentStep = steps.find((s) => s.step === selectedStep) || steps[0];

  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]"></span>
            <span>Clear, Direct & Transparent</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            How HireSphere Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280] leading-relaxed">
            Explore the exact step-by-step workflow designed to take candidates from tangible work directly to the interview table.
          </p>

          {/* Workflow Toggle Buttons */}
          <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-[#FFFDF5] border border-[#FFD600]">
            <button
              type="button"
              onClick={() => {
                setActiveWorkflow('candidate');
                setSelectedStep(1);
              }}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeWorkflow === 'candidate'
                  ? 'bg-[#FFD600] text-[#1A1A1A] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              Candidate Journey (8 Steps)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveWorkflow('recruiter');
                setSelectedStep(1);
              }}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeWorkflow === 'recruiter'
                  ? 'bg-[#FFD600] text-[#1A1A1A] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              Recruiter Journey (8 Steps)
            </button>
          </div>
        </div>

        {/* 8 Step Tabs & Detail Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Step List */}
          <div className="lg:col-span-7 space-y-2.5">
            {steps.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setSelectedStep(s.step)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  selectedStep === s.step
                    ? 'bg-[#FFFDF5] border-[#FFD600] shadow-sm'
                    : 'bg-white border-[#E5E7EB] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      selectedStep === s.step
                        ? 'bg-[#FFD600] text-[#1A1A1A]'
                        : 'bg-gray-100 text-[#6B7280]'
                    }`}
                  >
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-[#6B7280] line-clamp-1">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[#6B7280]">
                  {selectedStep === s.step && (
                    <span className="inline-block w-2 h-2 rounded-full bg-[#FFD600]"></span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Step Deep Dive */}
          <div className="lg:col-span-5 sticky top-24 bg-[#FFFDF5] rounded-3xl border border-[#FFD600] p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#FFD600]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Step 0{currentStep.step} of 08
              </span>
              <span className="text-xs font-bold text-[#1A1A1A] bg-[#FFD600] px-2.5 py-0.5 rounded-full">
                {activeWorkflow === 'candidate' ? 'Candidate Path' : 'Recruiter Path'}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight mb-3">
                {currentStep.title}
              </h3>
              <p className="text-sm text-[#1A1A1A] leading-relaxed mb-4">
                {currentStep.desc}
              </p>
              <div className="p-4 bg-white rounded-2xl border border-[#E5E7EB] text-xs text-[#6B7280] leading-relaxed">
                <strong className="block text-[#1A1A1A] mb-1 font-semibold">Key Advantage:</strong>
                {currentStep.detail}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280]">
              <button
                type="button"
                disabled={selectedStep === 1}
                onClick={() => setSelectedStep((prev) => Math.max(1, prev - 1))}
                className="font-semibold text-[#1A1A1A] disabled:opacity-30 hover:underline"
              >
                ← Previous Step
              </button>
              <button
                type="button"
                disabled={selectedStep === 8}
                onClick={() => setSelectedStep((prev) => Math.min(8, prev + 1))}
                className="font-semibold text-[#1A1A1A] disabled:opacity-30 hover:underline"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailed;

