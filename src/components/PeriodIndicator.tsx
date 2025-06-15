import React from 'react';

interface PeriodIndicatorProps {
  currentPeriod: number;
  totalPeriods: number;
  matchType: 'pool' | 'elimination' | 'team' | 'freeform';
  isBreak: boolean;
  isOvertime: boolean;
}

const OvertimeDot: React.FC = () => (
  <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" aria-label="Overtime" />
);

const PeriodIndicator: React.FC<PeriodIndicatorProps> = ({ 
  currentPeriod, 
  totalPeriods, 
  matchType, 
  isBreak, 
  isOvertime
}) => {
  if (matchType === 'pool' || matchType === 'freeform') {
    return null;
  }

  if (matchType === 'team') {
    return (
      <div className="flex space-x-1 items-center">
        {Array.from({ length: 9 }).map((_, index) => {
          const boutNumber = index + 1;
          return (
            <div 
              key={`bout-${boutNumber}`}
              className={`h-2 w-6 rounded-full ${
                boutNumber === currentPeriod
                  ? 'bg-purple-400' 
                  : boutNumber < currentPeriod
                    ? 'bg-gray-400' 
                    : 'bg-gray-700'
              }`}
              aria-label={boutNumber === currentPeriod ? `Current bout ${currentPeriod}` : `Bout ${boutNumber}`}
            />
          );
        })}
        
        {isOvertime && <OvertimeDot/>}
      </div>
    );
  }
  
  // For elimination matches
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
      
      {isOvertime && <OvertimeDot/>}
    </div>
  );
};

export default PeriodIndicator;