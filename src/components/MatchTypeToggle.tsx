import React from 'react';
import { MatchType } from '../types';

interface MatchTypeToggleProps {
  matchType: MatchType;
  onChange: (type: MatchType) => void;
}

const MatchTypeToggle: React.FC<MatchTypeToggleProps> = ({ matchType, onChange }) => {
  return (
    <div className="flex w-full rounded-lg overflow-hidden border border-gray-600">
      <button
        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          matchType === 'pool'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
        onClick={() => onChange('pool')}
      >
        Pool (5 pts)
      </button>
      <button
        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          matchType === 'elimination'
            ? 'bg-gray-700 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
        onClick={() => onChange('elimination')}
      >
        Elimination (15 pts)
      </button>
    </div>
  );
};

export default MatchTypeToggle