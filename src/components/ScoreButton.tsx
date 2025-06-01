import React from 'react';

interface ScoreButtonProps {
  type: 'increment' | 'decrement';
  onClick: () => void;
}

const ScoreButton: React.FC<ScoreButtonProps> = ({ type, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        type === 'increment' ? 'text-neon-green' : 'text-neon-red'
      } text-7xl font-bold hover:scale-110 transition-transform duration-150 focus:outline-none`}
      aria-label={type === 'increment' ? 'Increment score' : 'Decrement score'}
    >
      {type === 'increment' ? '+' : '−'}
    </button>
  );
};

export default ScoreButton;