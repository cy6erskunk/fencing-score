import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="text-white hover:text-gray-300 transition-colors duration-150 focus:outline-none"
      aria-label="Swap fencer positions"
    >
      <ArrowLeftRight size={36} />
    </button>
  );
};

export default SwapButton;