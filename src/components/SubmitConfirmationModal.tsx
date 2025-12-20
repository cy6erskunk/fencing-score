import React, { useState } from 'react';
import { X, AlertCircle, ArrowLeftRight } from 'lucide-react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (winner: string) => void;
  leftFencerName: string;
  rightFencerName: string;
  leftScore: number;
  rightScore: number;
  suggestedWinner: string;
  isSubmitting?: boolean;
}

const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leftFencerName,
  rightFencerName,
  leftScore,
  rightScore,
  suggestedWinner,
  isSubmitting = false,
}) => {
  const [selectedWinner, setSelectedWinner] = useState(suggestedWinner);

  React.useEffect(() => {
    setSelectedWinner(suggestedWinner);
  }, [suggestedWinner]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedWinner);
  };

  const handleSwitch = () => {
    setSelectedWinner(prev =>
      prev === leftFencerName ? rightFencerName : leftFencerName
    );
  };

  const scoresAreTied = leftScore === rightScore;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 relative border border-cyan-500/30">
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <AlertCircle size={32} className="text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">Confirm Match Result</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Left Fencer</div>
                <div className="text-lg font-bold text-white">{leftFencerName}</div>
              </div>
              <div className="text-3xl font-bold text-cyan-500">{leftScore}</div>
            </div>
            <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Right Fencer</div>
                <div className="text-lg font-bold text-white">{rightFencerName}</div>
              </div>
              <div className="text-3xl font-bold text-cyan-500">{rightScore}</div>
            </div>
          </div>

          {scoresAreTied && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3 text-yellow-200 text-sm">
              <strong>Note:</strong> Scores are tied. Winner determined by priority.
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-3">Winner</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-green-400">{selectedWinner}</div>
              <button
                onClick={handleSwitch}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftRight size={16} />
                Switch
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;
