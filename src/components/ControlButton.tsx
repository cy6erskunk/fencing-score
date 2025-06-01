import React from 'react';

interface ControlButtonProps {
  onClick: () => void;
  type: 'start' | 'reset' | 'settings';
  isRunning?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, type, isRunning }) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'start':
        return {
          className: `bg-neon-green/10 hover:bg-neon-green/20 text-neon-green border-2 border-neon-green/50 
                     py-6 px-12 rounded-lg text-4xl font-bold transition-all duration-200 
                     ${isRunning ? 'animate-pulse' : ''}`,
          text: isRunning ? 'Pause' : 'Start'
        };
      case 'reset':
        return {
          className: 'bg-neon-red/10 hover:bg-neon-red/20 text-neon-red border-2 border-neon-red/50 py-3 px-8 rounded-lg text-xl font-bold transition-all duration-200',
          text: 'Reset'
        };
      case 'settings':
        return {
          className: 'text-white bg-gray-700/50 hover:bg-gray-700 rounded-full p-2 transition-all duration-200',
          text: '⚙️'
        };
      default:
        return {
          className: 'bg-gray-700 text-white py-3 px-6 rounded-lg',
          text: 'Button'
        };
    }
  };

  const style = getButtonStyle();

  return (
    <button 
      onClick={onClick} 
      className={style.className}
      aria-label={type}
    >
      {style.text}
    </button>
  );
};

export default ControlButton;