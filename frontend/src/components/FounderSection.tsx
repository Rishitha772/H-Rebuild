import React from 'react';
import {
  Sparkles,
  Mail,
  Quote,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section id="founder" className="relative py-20 md:py-28 bg-gradient-to-b from-white via-[#FFFDF5] to-[#FFFDF5] border-t border-[#E5E7EB] overflow-hidden">
      {/* Radiant warm golden background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FFD600]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Kicker */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF5] border border-[#FFD600] text-xs font-bold text-[#1A1A1A] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
            <span>Leadership & Founding Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight">
            Meet the Visionary Behind HireSphere
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
            Redefining technical hiring through practical merit, transparent task evaluation, and direct access to opportunity.
          </p>
        </div>

        {/* Founder Card Spotlight */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#FFD600]/60 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Left: Founder Portrait Frame with Warm Golden Accent */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#FFFDF5] via-white to-[#FFFDF5] p-8 sm:p-10 flex flex-col justify-between text-[#1A1A1A] border-b lg:border-b-0 lg:border-r border-[#E5E7EB] relative overflow-hidden">
              <div className="relative z-10">
                {/* Photo container with modern architectural styling & warm golden ring */}
                <div className="relative mx-auto lg:mx-0 w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden ring-4 ring-[#FFD600] shadow-xl group bg-amber-100">
                  <img
                    src="/assets/aistudio/rishitha_debe3793.jpeg"
                    alt="Rishitha Khandesh - Founder & Chief Executive Officer of HireSphere"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="mt-6 text-center lg:text-left">
                  <h3 className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
                    Rishitha Khandesh
                  </h3>
                  <div className="text-sm font-bold text-[#1A1A1A] mt-1 flex items-center justify-center lg:justify-start gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFD600]"></span>
                    Founder & Chief Executive Officer
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5 font-medium">
                    Product Architect · Visionary · Tech Community Builder
                  </div>
                </div>
              </div>

              {/* Direct touchpoints & credentials */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB] relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <a
                    href="mailto:rishithakhandesh@gmail.com"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#1A1A1A] text-xs font-bold border border-[#E5E7EB] shadow-xs transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    <span>Get in Touch</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-[#1A1A1A] text-xs font-bold shadow-xs transition"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="text-[11px] text-[#6B7280] text-center lg:text-left font-mono font-medium">
                  HireSphere Technologies · Built for Practical Merit
                </div>
              </div>
            </div>

            {/* Right: The Founder's Mission Letter & Core Tenets */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-white">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FFFDF5] border border-[#FFD600] flex items-center justify-center text-[#1A1A1A] mb-6 shadow-xs">
                  <Quote className="w-5 h-5 text-[#1A1A1A]" />
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
                  A Message from the Founder
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight leading-snug mb-4">
                  "Your ability to build, solve, and execute should matter infinitely more than resume pedigree."
                </h4>

                <div className="space-y-4 text-sm text-[#6B7280] leading-relaxed">
                  <p>
                    I founded HireSphere after witnessing countless exceptional software developers, designers, and analysts get filtered out by arbitrary screening rounds. Traditional hiring pushes talent through a gauntlet of aptitude quizzes, group discussions, and artificial puzzle challenges that bear almost no relationship to real-world engineering.
                  </p>
                  <p>
                    At the same time, recruiters and hiring managers spend weeks wading through keyword-stuffed resumes without knowing who can actually deliver production-ready code.
                  </p>
                  <p className="font-semibold text-[#1A1A1A] bg-[#FFFDF5] p-4 rounded-xl border border-[#FFD600]">
                    "HireSphere exists to establish a direct, transparent pipeline: <strong>From Task to Interview.</strong> When candidates complete real hiring tasks and companies evaluate practical performance, bias vanishes and genuine capability shines."
                  </p>
                </div>
              </div>

              {/* Guiding Principles Grid */}
              <div className="pt-6 border-t border-[#E5E7EB]">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider block mb-3">
                  Founding Principles Under Rishitha's Leadership
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#E5E7EB]">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1A1A1A] font-bold block">Proof-First Merit</strong>
                      <span className="text-[#6B7280]">Real deliverables over university pedigree</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#E5E7EB]">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1A1A1A] font-bold block">Time Respect</strong>
                      <span className="text-[#6B7280]">Zero unnecessary preliminary rounds</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#E5E7EB]">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1A1A1A] font-bold block">Transparent Rubrics</strong>
                      <span className="text-[#6B7280]">Candidates know exact grading standards</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#E5E7EB]">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1A1A1A] font-bold block">Direct Shortlisting</strong>
                      <span className="text-[#6B7280]">Walk straight into high-signal interviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;

