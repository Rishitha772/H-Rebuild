import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-[#E5E7EB]">
      <div className="w-14 h-14 rounded-2xl bg-[#FFFDF5] border border-[#FFD600]/50 flex items-center justify-center text-[#1A1A1A] mb-4">
        <Icon className="w-7 h-7 text-[#1A1A1A]" />
      </div>
      <h3 className="text-base font-bold text-[#1A1A1A] mb-1">{title}</h3>
      <p className="text-sm text-[#6B7280] max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFDF33] text-sm font-semibold text-[#1A1A1A] transition shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

