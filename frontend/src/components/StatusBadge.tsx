import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'shortlisted':
        return 'bg-[#FFD600] text-[#1A1A1A] font-semibold border-[#FFD600] shadow-sm';
      case 'under review':
        return 'bg-[#FFFDF5] text-[#1A1A1A] border-[#FFD600] font-medium';
      case 'submitted':
        return 'bg-white text-[#1A1A1A] border-[#1A1A1A] font-medium';
      case 'applied':
        return 'bg-gray-100 text-[#6B7280] border-[#E5E7EB]';
      case 'rejected':
        return 'bg-gray-50 text-[#6B7280] border-[#E5E7EB] line-through decoration-gray-400';
      case 'active':
        return 'bg-[#FFD600]/20 text-[#1A1A1A] border-[#FFD600] font-medium';
      case 'closed':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-50 text-[#6B7280] border-[#E5E7EB]';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border tracking-wide ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export default StatusBadge;

