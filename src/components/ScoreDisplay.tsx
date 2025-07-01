import React from 'react';

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, maxScore }) => {
  return (
    <div className="relative">
      <div className="text-white text-7xl font-bold w-32 text-center">{score}</div>
      <div className="text-gray-500 text-xs absolute top-0 right-0 mt-1 mr-1">/{maxScore}</div>
    </div>
  );
};

export default ScoreDisplay;