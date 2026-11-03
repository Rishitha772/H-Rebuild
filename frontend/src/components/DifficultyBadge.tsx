import React from 'react';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const getStyle = () => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-gray-100 text-[#1A1A1A] border-[#E5E7EB]';
      case 'intermediate':
        return 'bg-[#FFFDF5] text-[#1A1A1A] border-[#FFD600] font-medium';
      case 'advanced':
        return 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-medium';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${getStyle()}`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;

