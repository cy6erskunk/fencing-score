import React, { useState, useEffect } from 'react';
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
  side, 
  score, 
  maxScore, 
  cards,
  passivityCards,
  onScoreChange,
  fencerName
}) => {
  const [scoreChangeIndicator, setScoreChangeIndicator] = useState<string | null>(null);

  useEffect(() => {
    if (scoreChangeIndicator) {
      const timer = setTimeout(() => {
        setScoreChangeIndicator(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [scoreChangeIndicator]);

  const handleIncrement = () => {
    if (score < maxScore) {
      onScoreChange(score + 1);
      setScoreChangeIndicator('+1');
    }
  };

  const handleDecrement = () => {
    if (score > 0) {
      onScoreChange(score - 1);
      setScoreChangeIndicator('-1');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <ScoreButton type="increment" onClick={handleIncrement} />
      <div className="flex flex-col items-center">
        {fencerName && (
          <div className="text-center mb-2">
            <div className="text-cyan-400 text-sm font-medium truncate max-w-24">
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
      
      {scoreChangeIndicator && (
        <div 
          className={`absolute ${side === 'left' ? 'left-20' : 'right-20'} bottom-32 
                     ${scoreChangeIndicator.startsWith('+') ? 'text-neon-green' : 'text-neon-red'} 
                     text-3xl font-bold animate-fadeOut`}
        >
          {scoreChangeIndicator}
        </div>
      )}
    </div>
  );
};

export default ScorePanel;