import React from 'react';

interface PeriodIndicatorProps {
  currentPeriod: number;
  totalPeriods: number;
  matchType: 'pool' | 'elimination';
}

const PeriodIndicator: React.FC<PeriodIndicatorProps> = ({ currentPeriod, totalPeriods, matchType }) => {
  if (matchType === 'pool') {
    return null;
  }
  
  return (
    <div className="flex space-x-2 items-center">
      {Array.from({ length: totalPeriods }).map((_, index) => (
        <div 
          key={index}
          className={`h-2 w-8 rounded-full ${
            index + 1 === currentPeriod 
              ? 'bg-white' 
              : index + 1 < currentPeriod 
                ? 'bg-gray-400' 
                : 'bg-gray-700'
          }`}
          aria-label={index + 1 === currentPeriod ? `Current period ${currentPeriod}` : `Period ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PeriodIndicator;