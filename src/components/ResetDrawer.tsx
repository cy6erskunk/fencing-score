import React from 'react';
import { X } from 'lucide-react';

interface ResetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onResetTime: () => void;
  onResetScore: () => void;
  onResetAll: () => void;
}

const ResetDrawer: React.FC<ResetDrawerProps> = ({
  isOpen,
  onClose,
  onResetTime,
  onResetScore,
  onResetAll,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={onClose}
      />
      <div className={`fixed inset-x-0 bottom-0 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="bg-gray-900 rounded-t-xl p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Reset Options</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => { onResetTime(); onClose(); }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Reset Time
            </button>
            
            <button
              onClick={() => { onResetScore(); onClose(); }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Reset Score
            </button>
            
            <button
              onClick={() => { onResetAll(); onClose(); }}
              className="w-full bg-neon-red/10 hover:bg-neon-red/20 text-neon-red border-2 border-neon-red/50 py-3 px-4 rounded-lg transition-colors"
            >
              Reset All
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetDrawer;