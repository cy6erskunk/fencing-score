import React from 'react';

interface BoutIndicatorProps {
  isOvertime: boolean;
  matchType: 'pool' | 'elimination';
  currentPeriod: number;
  isBreak: boolean;
}

interface IndicatorConfig {
  text: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const BoutIndicator: React.FC<BoutIndicatorProps> = ({ isOvertime, matchType, currentPeriod, isBreak }) => {
  const getIndicatorConfig = (): IndicatorConfig => {
    if (isOvertime) {
      return {
        text: 'OVERTIME',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        textColor: 'text-yellow-500'
      };
    }

    if (isBreak) {
      return {
        text: 'BREAK',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/50',
        textColor: 'text-blue-400'
      };
    }

    if (matchType === 'elimination') {
      return {
        text: `PERIOD ${currentPeriod}`,
        bgColor: 'bg-gray-700/50',
        borderColor: 'border-gray-600/50',
        textColor: 'text-white'
      };
    }

    return {
      text: 'POOL BOUT',
      bgColor: 'bg-gray-700/50',
      borderColor: 'border-gray-600/50',
      textColor: 'text-white'
    };
  };

  const config = getIndicatorConfig();

  return (
    <div className="flex items-center justify-center mb-4">
      <div className={`${config.bgColor} border-2 ${config.borderColor} px-4 py-2 rounded-lg`}>
        <div className={`${config.textColor} text-lg font-bold`}>
          {config.text}
        </div>
      </div>
    </div>
  );
};

export default BoutIndicator;