import React from 'react';

interface PeriodIndicatorProps {
  currentPeriod: number;
  totalPeriods: number;
  matchType: 'pool' | 'elimination';
  isBreak: boolean;
}

const PeriodIndicator: React.FC<PeriodIndicatorProps> = ({ currentPeriod, totalPeriods, matchType, isBreak }) => {
  if (matchType === 'pool') {
    return null;
  }
  
  return (
    <div className="flex space-x-2 items-center">
      {Array.from({ length: totalPeriods * 2 - 1 }).map((_, index) => {
        const isBreakIndicator = index % 2 === 1;
        const periodNumber = Math.floor(index / 2) + 1;
        const breakNumber = Math.floor((index + 1) / 2);
        
        if (isBreakIndicator) {
          return (
            <div 
              key={`break-${breakNumber}`}
              className={`h-2 w-2 rounded-full ${
                isBreak && breakNumber === currentPeriod
                  ? 'bg-white' 
                  : breakNumber < currentPeriod 
                    ? 'bg-gray-400' 
                    : 'bg-gray-700'
              }`}
              aria-label={`Break ${breakNumber}`}
            />
          );
        }
        
        return (
          <div 
            key={`period-${periodNumber}`}
            className={`h-2 w-8 rounded-full ${
              periodNumber === currentPeriod && !isBreak
                ? 'bg-white' 
                : periodNumber < currentPeriod 
                  ? 'bg-gray-400' 
                  : 'bg-gray-700'
            }`}
            aria-label={periodNumber === currentPeriod ? `Current period ${currentPeriod}` : `Period ${periodNumber}`}
          />
        );
      })}
    </div>
  );
};

export default PeriodIndicator;