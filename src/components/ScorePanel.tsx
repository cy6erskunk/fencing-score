import React from 'react';
import ScoreButton from './ScoreButton';
import ScoreDisplay from './ScoreDisplay';
import { Card, PassivityCard } from '../types';

interface ScorePanelProps {
  side: 'left' | 'right';
  score: number;
  maxScore: number;
  cards: Card[];
  passivityCards: PassivityCard[];
  onScoreChange: (value: number) => void;
  fencerName?: string;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ 
  score, 
  maxScore, 
  cards,
  passivityCards,
  onScoreChange,
  fencerName
}) => {
  const handleIncrement = () => {
    if (score < maxScore) {
      onScoreChange(score + 1);
    }
  };

  const handleDecrement = () => {
    if (score > 0) {
      onScoreChange(score - 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <ScoreButton type="increment" onClick={handleIncrement} />
      <div className="flex flex-col items-center">
        {fencerName && (
          <div className="text-center mb-2">
            <div 
              className="text-cyan-400 text-sm font-medium truncate max-w-24"
              aria-label={`Fencer name: ${fencerName}`}
              title={fencerName}
            >
              {fencerName}
            </div>
          </div>
        )}
        <ScoreDisplay score={score} maxScore={maxScore} />
        <div className="flex space-x-1 mt-2">
          {cards.map((card, index) => (
            <div
              key={`${card}-${index}`}
              className={`w-4 h-4 rounded ${
                card === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          ))}
          {passivityCards.map((card, index) => (
            <div
              key={`${card}-${index}`}
              className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold ${
                card === 'pYellow' 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-red-500 text-white'
              }`}
            >
              P
            </div>
          ))}
        </div>
      </div>
      <ScoreButton type="decrement" onClick={handleDecrement} />
    </div>
  );
};

export default ScorePanel;