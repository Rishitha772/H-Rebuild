import React from 'react';
import { ShieldCheck, Target, Zap, Users, CheckCircle2, Award } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const brandPillars = [
    {
      title: 'Real Skills Over Resume Pedigree',
      description:
        'A candidate’s ability to architect, code, design, or analyze a concrete problem tells recruiters infinitely more than university tier or previous company logo.',
    },
    {
      title: 'Respect for Candidate Time',
      description:
        'Eliminating arbitrary preliminary speed puzzles, GDs, and aptitude quizzes so candidates spend their energy on practical, portfolio-worthy work.',
    },
    {
      title: 'Predictable Hiring Signal for Teams',
      description:
        'Hiring managers review real code, schema designs, and test suites prior to the interview room, dramatically shortening hiring cycles.',
    },
    {
      title: 'Professional Respect Grounded in Craft',
      description:
        'Talent and recruiters forge genuine relationships centered on demonstrated capability and technical mutual respect.',
    },
  ];

  return (
    <section id="about-us" className="py-20 md:py-24 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]"></span>
            <span>Our Philosophy & Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            "From Task to Interview. Let Your Skills Speak."
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed">
            HireSphere was conceived on a straightforward realization: the modern tech hiring process is cluttered with multi-stage hurdles that test test-taking abilities rather than real-world job capabilities.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-5 text-sm text-[#6B7280] leading-relaxed">
            <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              A Skill-Focused Hiring Ecosystem Built on Demonstrable Performance
            </h3>
            <p>
              In conventional recruiting, candidates spend weeks grinding rote theoretical questions that never appear in daily engineering work. Meanwhile, hiring managers read hundreds of keyword-optimized resumes without knowing who can actually deliver production-ready software.
            </p>
            <p>
              HireSphere bridges this divide. We allow companies to publish actual hiring tasks related to their real open positions. Candidates work on these challenges, demonstrating their true craft, architectural thoughtfulness, and problem-solving abilities.
            </p>
            <p className="font-semibold text-[#1A1A1A] bg-[#FFFDF5] p-4 rounded-2xl border border-[#FFD600]">
              When work speaks for itself, candidate shortlisting becomes direct, objective, and deeply respectful of everyone’s time.
            </p>
          </div>

          <div className="bg-[#FFFDF5] rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
            <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-6 pb-2 border-b border-[#E5E7EB]">
              What We Believe In
            </h4>

            <div className="space-y-5">
              {brandPillars.map((p, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-[#FFD600] flex items-center justify-center shrink-0 mt-0.5 text-[#1A1A1A]">
                    <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1A1A1A]">{p.title}</h5>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

