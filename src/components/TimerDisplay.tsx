import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-white text-8xl font-bold tracking-wider">
      {formatTime(timeRemaining)}
    </div>
  );
};

export default TimerDisplay;