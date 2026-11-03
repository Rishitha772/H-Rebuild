import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types';
import StatusBadge from './StatusBadge';
import DifficultyBadge from './DifficultyBadge';
import { Calendar, DollarSign, Users, ArrowRight, Building, Sparkles } from 'lucide-react';
import { calculateSkillMatch } from '../utils/skillMatcher';

interface TaskCardProps {
  task: Task;
  candidateSkills?: string[];
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, candidateSkills }) => {
  const skillsList = task.required_skills
    ? task.required_skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const displaySkills = skillsList.slice(0, 4);

  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Open Rolling';

  // Calculate skill match if candidate skills provided
  const matchResult =
    candidateSkills && candidateSkills.length > 0 && skillsList.length > 0
      ? calculateSkillMatch(candidateSkills, skillsList)
      : null;

  return (
    <div className="group bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#FFD600] p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Category & Difficulty & Has Applied */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] bg-gray-100 px-2.5 py-1 rounded-md">
              {task.category}
            </span>
            <DifficultyBadge difficulty={task.difficulty} />
          </div>

          <div className="flex items-center gap-1.5">
            {matchResult && matchResult.matchPercentage > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFD600] text-[#1A1A1A]">
                <Sparkles className="w-3 h-3" />
                {matchResult.matchPercentage}% Match
              </span>
            )}
            {task.has_applied && task.application_status && (
              <StatusBadge status={task.application_status} />
            )}
          </div>
        </div>

        {/* Task Title */}
        <Link to={`/tasks/${task.id}`}>
          <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-black transition line-clamp-2 leading-snug mb-2">
            {task.title}
          </h3>
        </Link>

        {/* Company & Recruiter info */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-4">
          <Building className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span className="font-medium text-[#1A1A1A]">
            {task.recruiter?.company_name || task.recruiter?.full_name || 'Hiring Team'}
          </span>
          {task.recruiter?.designation && (
            <span>• {task.recruiter.designation}</span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-sm text-[#6B7280] line-clamp-2 mb-5 leading-relaxed">
          {task.description}
        </p>

        {/* Skills Chips */}
        {displaySkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {displaySkills.map((skill, i) => {
              const isMatched =
                candidateSkills &&
                candidateSkills.some(
                  (c) => c.toLowerCase() === skill.toLowerCase()
                );
              return (
                <span
                  key={i}
                  className={`text-xs px-2.5 py-0.5 rounded-lg font-medium border ${
                    isMatched
                      ? 'bg-[#FFD600]/30 text-[#1A1A1A] border-[#FFD600] font-bold'
                      : 'bg-[#FFFDF5] text-[#1A1A1A] border-[#E5E7EB]'
                  }`}
                >
                  {skill} {isMatched ? '✓' : ''}
                </span>
              );
            })}
            {skillsList.length > 4 && (
              <span className="text-xs text-[#6B7280] py-0.5 px-1 font-medium">
                +{skillsList.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Details & Action */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <div className="grid grid-cols-2 gap-2 text-xs text-[#6B7280] mb-4">
          {task.compensation ? (
            <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
              <DollarSign className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span className="truncate">{task.compensation}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-500">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Competitive</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 justify-end">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{task.application_count} {task.application_count === 1 ? 'applicant' : 'applicants'}</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Due {formattedDeadline}</span>
          </div>
        </div>

        <Link
          to={`/tasks/${task.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#FFD600] text-sm font-semibold text-[#1A1A1A] transition duration-150 border border-[#E5E7EB] hover:border-[#FFD600]"
        >
          View Task
          <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
