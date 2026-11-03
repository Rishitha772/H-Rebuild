import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  TrendingUp,
  Sliders,
  DollarSign,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const InteractiveExplorer: React.FC = () => {
  const [openRolesCount, setOpenRolesCount] = useState<number>(3);
  const [currentRounds, setCurrentRounds] = useState<number>(5);
  const [candidateVolume, setCandidateVolume] = useState<number>(50);

  // Calculations
  const traditionalDaysToHire = currentRounds * 7;
  const hireSphereDaysToHire = 9;
  const daysSaved = Math.max(0, traditionalDaysToHire - hireSphereDaysToHire);

  const engineeringHoursPerHireTraditional = candidateVolume * 0.5 + currentRounds * 8;
  const engineeringHoursPerHireHireSphere = 4 * 1.5 + 2 * 1;
  const hoursSaved = Math.round(
    Math.max(0, (engineeringHoursPerHireTraditional - engineeringHoursPerHireHireSphere) * openRolesCount)
  );

  const estimatedCostSaved = hoursSaved * 85;

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-[#FFFDF5] via-white to-[#FFFDF5] text-[#1A1A1A] relative overflow-hidden border-b border-[#E5E7EB]">
      {/* Warm Golden ambient lighting */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFD600]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#FFD600] text-xs font-bold text-[#1A1A1A] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Interactive Hiring Impact Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A]">
            Calculate Your Task-to-Interview Advantage
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            See how replacing preliminary screening rounds with practical task-based evaluation transforms your time-to-hire, engineering bandwidth, and candidate experience.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#FFD600] p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Input Column */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#1A1A1A]" />
              <span>Current Hiring Pipeline Metrics</span>
            </h3>

            {/* Slider 1: Open Roles */}
            <div className="bg-[#FFFDF5] p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#1A1A1A] font-semibold">Open Roles / Positions</span>
                <span className="font-mono font-bold text-[#1A1A1A] text-sm bg-white px-2.5 py-0.5 rounded-lg border border-[#FFD600]">
                  {openRolesCount} Roles
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={openRolesCount}
                onChange={(e) => setOpenRolesCount(Number(e.target.value))}
                className="w-full accent-[#FFD600] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B7280] font-mono">
                <span>1 Role</span>
                <span>8 Roles</span>
                <span>15 Roles</span>
              </div>
            </div>

            {/* Slider 2: Current Screening Rounds */}
            <div className="bg-[#FFFDF5] p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#1A1A1A] font-semibold">
                  Current Screening Rounds (Resume, GD, Aptitude, DSA)
                </span>
                <span className="font-mono font-bold text-[#1A1A1A] text-sm bg-white px-2.5 py-0.5 rounded-lg border border-[#FFD600]">
                  {currentRounds} Rounds
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={currentRounds}
                onChange={(e) => setCurrentRounds(Number(e.target.value))}
                className="w-full accent-[#FFD600] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B7280] font-mono">
                <span>3 Rounds</span>
                <span>5 Rounds</span>
                <span>8 Rounds</span>
              </div>
            </div>

            {/* Slider 3: Applicants Screened */}
            <div className="bg-[#FFFDF5] p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#1A1A1A] font-semibold">
                  Average Applicants per Position
                </span>
                <span className="font-mono font-bold text-[#1A1A1A] text-sm bg-white px-2.5 py-0.5 rounded-lg border border-[#FFD600]">
                  {candidateVolume} Applicants
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={candidateVolume}
                onChange={(e) => setCandidateVolume(Number(e.target.value))}
                className="w-full accent-[#FFD600] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6B7280] font-mono">
                <span>20</span>
                <span>100</span>
                <span>200</span>
              </div>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-6 bg-[#FFFDF5] p-6 sm:p-8 rounded-2xl border border-[#FFD600] space-y-5">
            <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Projected HireSphere Savings & Speed
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>Days Saved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                  ~{daysSaved} Days
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">Faster time-to-offer</div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>Engineer Hours</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                  {hoursSaved} hrs
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">Returned to shipping</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#FFD600] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6B7280] block">Estimated Bandwidth Savings</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A]">
                  ${estimatedCostSaved.toLocaleString()}
                </span>
              </div>
              <span className="text-xs font-bold text-[#1A1A1A] bg-[#FFD600] px-3 py-1.5 rounded-lg">
                High ROI
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/register?role=recruiter"
                className="w-full text-center py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] font-bold text-xs text-[#1A1A1A] shadow-xs transition"
              >
                Post a Hiring Task
              </Link>
              <Link
                to="/tasks"
                className="w-full text-center py-3 rounded-xl border border-[#E5E7EB] hover:border-black font-semibold text-xs text-[#1A1A1A] bg-white transition"
              >
                Explore Open Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveExplorer;

