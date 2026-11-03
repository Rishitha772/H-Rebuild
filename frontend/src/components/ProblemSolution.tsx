import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  XCircle,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  const candidateFrictions = [
    {
      title: 'Endless Preliminary Screening Rounds',
      desc: 'Candidates endure redundant layers—aptitude quizzes, group discussions, and arbitrary puzzle rounds—before ever speaking to a hiring manager.',
    },
    {
      title: 'Resumes Fail to Prove Practical Ability',
      desc: 'A bullet point list cannot demonstrate code architecture, edge-case testing, or thoughtful user interface decisions.',
    },
    {
      title: 'Talented Freshers & Switchers are Filtered Out',
      desc: 'Graduates and career switchers without prestigious brand names are routinely discarded by automated keyword scrapers.',
    },
    {
      title: 'Preparation Fatigue on Irrelevant Topics',
      desc: 'Weeks spent grinding esoteric tricks and trivia that bear zero resemblance to daily engineering or design work.',
    },
    {
      title: 'Real-World Craft is Overlooked',
      desc: 'High practical competence in building real features is ignored in favor of speed memorization.',
    },
  ];

  const recruiterFrictions = [
    {
      title: 'Resume Opacity & Keyword Inflation',
      desc: 'Recruiters drown in hundreds of polished resumes that look identical on paper but fail basic practical execution in late stages.',
    },
    {
      title: 'Costly & Drawn-Out Hiring Cycles',
      desc: 'Coordinating multi-tier screening schedules across weeks consumes expensive senior engineering hours and inflates cost-per-hire.',
    },
    {
      title: 'High False Positives & Mismatched Hires',
      desc: 'Candidates who pass theoretical puzzle interviews often struggle when tasked with maintaining production codebases.',
    },
    {
      title: 'Difficulty Gauging Real-World Capabilities',
      desc: 'Traditional 45-minute whiteboard formats cannot evaluate code readability, dependency management, or documentation hygiene.',
    },
  ];

  const traditionalStages = [
    { step: 1, name: 'Resume Screening', note: 'Subject to keyword bias' },
    { step: 2, name: 'Aptitude Test', note: 'Generic puzzles' },
    { step: 3, name: 'Group Discussion', note: 'Personality gatekeeper' },
    { step: 4, name: 'DSA / Speed Coding', note: 'Memorized trivia' },
    { step: 5, name: 'Technical Rounds', note: 'Late-stage evaluation' },
    { step: 6, name: 'Interview', note: 'Final interview' },
  ];

  const hireSphereStages = [
    { step: 1, name: 'Discover a Hiring Task', note: 'Practical challenge' },
    { step: 2, name: 'Complete the Task', note: 'In candidate environment' },
    { step: 3, name: 'Submit Your Work', note: 'Repo, demo & rationale' },
    { step: 4, name: 'Company Evaluation', note: 'Objective rubric scoring' },
    { step: 5, name: 'Direct Shortlisting', note: 'Walk straight into interview' },
  ];

  return (
    <section id="problem" className="py-20 md:py-24 bg-[#FFFDF5] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#FFD600] text-[#1A1A1A] text-xs font-bold mb-3 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>The Screening Bottleneck</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Why Should Hiring Be More Complicated Than It Needs to Be?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Conventional hiring relies on indirect proxies and multiple screening rounds to guess candidate competence. HireSphere replaces guesswork with tangible performance.
          </p>
        </div>

        {/* Dual Problem Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Candidate Problems Card */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E7EB]">
              <div className="w-9 h-9 rounded-xl bg-gray-100 text-[#1A1A1A] flex items-center justify-center font-bold">
                <XCircle className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  For Candidates: Redundant Hurdles & Disconnect
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Hours wasted on gatekeepers that don't evaluate your actual craft
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {candidateFrictions.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-[#6B7280]">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">{f.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Problems Card */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E7EB]">
              <div className="w-9 h-9 rounded-xl bg-gray-100 text-[#1A1A1A] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  For Recruiters: High Noise & Keyword Inflation
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Wading through resumes without knowing who can ship production code
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {recruiterFrictions.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-[#6B7280]">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">{f.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
              Compare the Two Hiring Realities
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Look at the steps required to reach an interview conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-[#E5E7EB] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    The Conventional Pipeline
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">6 Stages · ~4-6 Weeks</span>
                </div>

                <div className="space-y-3">
                  {traditionalStages.map((stage) => (
                    <div
                      key={stage.step}
                      className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between opacity-80"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-gray-200 text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                          {stage.step}
                        </span>
                        <span className="text-xs font-semibold text-[#1A1A1A]">{stage.name}</span>
                      </div>
                      <span className="text-[10px] text-[#6B7280]">{stage.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-center text-xs text-[#6B7280]">
                Outcome: High drop-off, heavy interview fatigue & keyword bias
              </div>
            </div>

            {/* The HireSphere Way */}
            <div className="p-6 rounded-2xl bg-[#FFFDF5] border-2 border-[#FFD600] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FFD600]/40">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                      The HireSphere Pipeline
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1A1A1A] bg-[#FFD600] px-2 py-0.5 rounded">
                    5 Direct Steps · ~7-9 Days
                  </span>
                </div>

                <div className="space-y-3">
                  {hireSphereStages.map((stage) => (
                    <div
                      key={stage.step}
                      className="p-3 bg-white rounded-xl border border-[#FFD600] flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#FFD600] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                          {stage.step}
                        </span>
                        <span className="text-xs font-bold text-[#1A1A1A]">{stage.name}</span>
                      </div>
                      <span className="text-[10px] font-medium text-[#1A1A1A] bg-[#FFFDF5] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {stage.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#FFD600]/40 text-center text-xs font-semibold text-[#1A1A1A]">
                Outcome: Real proof of craft, direct interview fast-track & 70% time saved
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;

