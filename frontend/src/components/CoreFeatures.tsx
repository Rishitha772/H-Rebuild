import React from 'react';
import {
  Code2,
  FileCheck2,
  Sliders,
  CheckCircle2,
  Award,
  Lock,
  Zap,
  DollarSign,
  Users2,
  Sparkles,
} from 'lucide-react';

export const CoreFeatures: React.FC = () => {
  const features = [
    {
      icon: Code2,
      title: 'Practical Task Catalog',
      desc: 'Browse assignments mirroring daily engineering challenges rather than artificial algorithmic puzzles.',
    },
    {
      icon: FileCheck2,
      title: 'Objective Evaluation Rubrics',
      desc: 'Hiring teams score deliverables against published standards for architecture, maintainability, and clean tests.',
    },
    {
      icon: Sliders,
      title: 'Skill Taxonomy & Match Engine',
      desc: 'Real-time calculation compares candidate skills with task prerequisites, showing exact match percentages.',
    },
    {
      icon: CheckCircle2,
      title: 'Repository & Live Demo Review',
      desc: 'Inspect candidate GitHub commit histories, modular structure, error handling, and deploy previews.',
    },
    {
      icon: Award,
      title: 'Direct Interview Shortlisting',
      desc: 'Bypass preliminary resume filters and HR aptitude gates to move directly into senior technical conversations.',
    },
    {
      icon: Lock,
      title: 'Confidential Recruiter Notes',
      desc: 'Private internal notes strictly isolated from candidates so engineering panels can collaborate securely.',
    },
    {
      icon: Zap,
      title: 'Instant Status & Feedback',
      desc: 'Candidates receive transparent rubric scores and constructive feedback rather than silence or generic rejections.',
    },
    {
      icon: DollarSign,
      title: 'Task Stipends & Rewards',
      desc: 'Compensate top candidates for their time with transparent stipends and interview fast-track perks.',
    },
    {
      icon: Users2,
      title: 'Role-Separated Dashboards',
      desc: 'Tailored consoles for candidates to track deliverables and recruiters to manage applicants effortlessly.',
    },
    {
      icon: Sparkles,
      title: 'Verified Meritocracy',
      desc: 'Equal opportunity for all builders. Eliminates university tier bias in favor of tangible execution.',
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-[#FFFDF5] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#FFD600] text-xs font-bold text-[#1A1A1A] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Built For Engineering Merit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            10 Pillars of the HireSphere Platform
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280] leading-relaxed">
            Everything candidates and hiring managers need to transform task-based hiring into a smooth, respectful, and high-signal experience.
          </p>
        </div>

        {/* 10 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#FFD600] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#FFFDF5] border border-[#FFD600] flex items-center justify-center text-[#1A1A1A] mb-3 shadow-2xs">
                    <Icon className="w-4 h-4 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-xs font-bold text-[#1A1A1A] mb-1.5 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#E5E7EB] text-[10px] font-mono text-[#6B7280]">
                  Feature {i < 9 ? `0${i + 1}` : i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;

