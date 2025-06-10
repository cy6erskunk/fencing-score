import React from 'react';

interface PriorityIndicatorProps {
  prioritySide: 'left' | 'right' | null;
  isOvertime: boolean;
}

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ prioritySide, isOvertime }) => {
  if (!isOvertime || !prioritySide) return null;
  
  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <div className="text-yellow-500 text-sm font-medium">PRIORITY:</div>
      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
        prioritySide === 'left' 
          ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
          : 'bg-gray-700 text-gray-400'
      }`}>
        LEFT
      </div>
      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
        prioritySide === 'right' 
          ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
          : 'bg-gray-700 text-gray-400'
      }`}>
        RIGHT
      </div>
    </div>
  );
};

export default PriorityIndicator;