import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const SPINNING_ANIMATION_DURATION_MS = 2000;

interface PriorityAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignPriority: (side: 'left' | 'right') => void;
}

const PriorityAssignmentModal: React.FC<PriorityAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssignPriority,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  const handleRandomAssignment = () => {
    // Clear any existing timeouts
    clearAllTimeouts();
    
    setIsSpinning(true);
    setSelectedSide(null);
    
    // Simulate spinning animation
    const spinTimeout = window.setTimeout(() => {
      const randomSide = Math.random() < 0.5 ? 'left' : 'right';
      setSelectedSide(randomSide);
      setIsSpinning(false);
      
      // Auto-confirm after showing result
      const confirmTimeout = window.setTimeout(() => {
        onAssignPriority(randomSide);
        handleClose();
      }, SPINNING_ANIMATION_DURATION_MS);
      
      timeoutRefs.current.push(confirmTimeout);
    }, SPINNING_ANIMATION_DURATION_MS);
    
    timeoutRefs.current.push(spinTimeout);
  };

  const handleManualAssignment = (side: 'left' | 'right') => {
    onAssignPriority(side);
    handleClose();
  };

  const handleClose = () => {
    setIsSpinning(false);
    setSelectedSide(null);
    onClose();
  };

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      clearAllTimeouts();
    }
    
    return () => {
      clearAllTimeouts();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity z-50"
        aria-hidden="true"
      />
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="priority-modal-title"
        aria-describedby="priority-modal-description"
        tabIndex={-1}
      >
        <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full space-y-6">
          <div className="flex justify-between items-center">
            <h2 id="priority-modal-title" className="text-2xl font-bold text-white">Priority Assignment</h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="text-center space-y-4">
            <p id="priority-modal-description" className="text-gray-300">
              The score is tied. Assign priority for the overtime bout.
            </p>
            
            <div className="flex justify-center space-x-8 my-8">
              <div className={`text-center transition-all duration-300 ${
                selectedSide === 'left' ? 'scale-110 text-neon-green' : 'text-white'
              }`}>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold ${
                  isSpinning ? 'animate-pulse border-yellow-500' : 
                  selectedSide === 'left' ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'
                }`}>
                  L
                </div>
                <p className="mt-2 text-sm">Left Fencer</p>
              </div>
              
              <div className={`text-center transition-all duration-300 ${
                selectedSide === 'right' ? 'scale-110 text-neon-green' : 'text-white'
              }`}>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold ${
                  isSpinning ? 'animate-pulse border-yellow-500' : 
                  selectedSide === 'right' ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'
                }`}>
                  R
                </div>
                <p className="mt-2 text-sm">Right Fencer</p>
              </div>
            </div>
            
            {selectedSide && (
              <div className="text-neon-green text-lg font-bold animate-pulse">
                {selectedSide === 'left' ? 'Left' : 'Right'} Fencer has priority!
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleRandomAssignment}
                disabled={isSpinning}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                  isSpinning 
                    ? 'bg-yellow-500/20 text-yellow-500 cursor-not-allowed' 
                    : 'bg-neon-green/10 hover:bg-neon-green/20 text-neon-green border-2 border-neon-green/50'
                }`}
              >
                {isSpinning ? 'Assigning Priority...' : 'Random Assignment'}
              </button>
              
              <div className="text-sm text-gray-400 text-center">or assign manually:</div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleManualAssignment('left')}
                  disabled={isSpinning}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Left Priority
                </button>
                <button
                  onClick={() => handleManualAssignment('right')}
                  disabled={isSpinning}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  Right Priority
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriorityAssignmentModal;