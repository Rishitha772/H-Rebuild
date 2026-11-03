import React from 'react';
import { Target, CheckCircle2, Award, Users } from 'lucide-react';

export const ValueStrip: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Practical Skill Demonstration',
      description: 'Candidates build actual assignments mirroring daily team requirements rather than solving artificial theoretical puzzles.',
    },
    {
      icon: CheckCircle2,
      title: 'Company-Driven Evaluation',
      description: 'Engineering and product leaders review functional deliverables directly against transparent, published evaluation rubrics.',
    },
    {
      icon: Award,
      title: 'Direct Interview Shortlisting',
      description: 'Successful task performance directly qualifies candidates for interview rounds, removing redundant preliminary screening.',
    },
    {
      icon: Users,
      title: 'Professional Networking',
      description: 'Genuine professional relationships formed between ambitious talent and hiring teams based on verified capability.',
    },
  ];

  return (
    <section className="border-y border-[#E5E7EB] bg-white py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]"></span>
            <span>The HireSphere Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Skills Over Screenshots. Performance Over Paperwork.
          </h2>
          <p className="mt-3 text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            A transparent meritocracy where demonstrated work replaces inflated resumes, subjective keyword filters, and repetitive preliminary screening.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFDF5] hover:bg-white hover:border-[#FFD600] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#FFD600] flex items-center justify-center text-[#1A1A1A] mb-4 shadow-xs">
                    <Icon className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E5E7EB] text-[11px] font-mono text-[#6B7280]">
                  0{idx + 1} / Core Pillar
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueStrip;

