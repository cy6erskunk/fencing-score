import React from 'react';
import { MatchType } from '../types';

const MatchTypeButton: React.FC<{
  type: MatchType;
  current: MatchType;
  onChange: (type: MatchType) => void;
  label: string;
}> = ({ type, current, onChange, label }) => (
  <button
    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      current === type
        ? 'bg-gray-700 text-white'
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`}
    onClick={() => onChange(type)}
  >
    {label}
  </button>
);

interface MatchTypeToggleProps {
  matchType: MatchType;
  onChange: (type: MatchType) => void;
}

const MatchTypeToggle: React.FC<MatchTypeToggleProps> = ({ matchType, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex rounded-lg overflow-hidden border border-gray-600">
        <MatchTypeButton
          type="pool"
          current={matchType}
          onChange={onChange}
          label="Pool (5 pts)"
        />
        <MatchTypeButton
          type="elimination"
          current={matchType}
          onChange={onChange}
          label="Elimination (15 pts)"
        />
      </div>
      <div className="flex rounded-lg overflow-hidden border border-gray-600">
        <MatchTypeButton
          type="team"
          current={matchType}
          onChange={onChange}
          label="Team Event (9 bouts)"
        />
        <MatchTypeButton
          type="freeform"
          current={matchType}
          onChange={onChange}
          label="Free-form"
        />
      </div>
    </div>
  );
};

export default MatchTypeToggle;