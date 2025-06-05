import React from 'react';
import { X } from 'lucide-react';
import { MatchType } from '../types';
import MatchTypeToggle from './MatchTypeToggle';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  matchType: MatchType;
  onMatchTypeChange: (type: MatchType) => void;
  onAddCard: (side: 'left' | 'right', card: 'yellow' | 'red') => void;
  onAddPassivityCards: (card: 'pYellow' | 'pRed') => void;
  hasYellowPassivityCard: boolean;
  hasRedPassivityCard: boolean;
  isEliminationMatch: boolean;
  timeRemaining: number;
  onTimeChange: (seconds: number) => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  matchType,
  onMatchTypeChange,
  onAddCard,
  onAddPassivityCards,
  hasYellowPassivityCard,
  hasRedPassivityCard,
  isEliminationMatch,
  timeRemaining,
  onTimeChange,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleMinutesChange = (increment: boolean) => {
    const newMinutes = increment 
      ? (minutes + 1) % 10 
      : minutes === 0 ? 9 : minutes - 1;
    const newTime = (newMinutes * 60) + seconds;
    onTimeChange(newTime);
  };

  const handleSecondsChange = (increment: boolean) => {
    const newSeconds = increment 
      ? (seconds + 1) % 60 
      : seconds === 0 ? 59 : seconds - 1;
    const newTime = (minutes * 60) + newSeconds;
    onTimeChange(newTime);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={onClose}
      />
      <div className={`fixed inset-x-0 top-0 transform ${isOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="bg-gray-900 rounded-b-xl p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Timer Control</label>
              <div className="flex space-x-4">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">Minutes</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMinutesChange(false)}
                      className="text-neon-red text-4xl font-bold hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center"
                      aria-label="Decrease minutes"
                    >
                      −
                    </button>
                    <div className="flex-1 bg-gray-800 rounded-lg py-3 px-4 text-center text-2xl font-bold">
                      {minutes.toString().padStart(2, '0')}
                    </div>
                    <button
                      onClick={() => handleMinutesChange(true)}
                      className="text-neon-green text-4xl font-bold hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center"
                      aria-label="Increase minutes"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">Seconds</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSecondsChange(false)}
                      className="text-neon-red text-4xl font-bold hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center"
                      aria-label="Decrease seconds"
                    >
                      −
                    </button>
                    <div className="flex-1 bg-gray-800 rounded-lg py-3 px-4 text-center text-2xl font-bold">
                      {seconds.toString().padStart(2, '0')}
                    </div>
                    <button
                      onClick={() => handleSecondsChange(true)}
                      className="text-neon-green text-4xl font-bold hover:scale-110 transition-transform w-12 h-12 flex items-center justify-center"
                      aria-label="Increase seconds"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Match Type</label>
              <MatchTypeToggle 
                matchType={matchType} 
                onChange={(type) => {
                  onMatchTypeChange(type);
                  onClose();
                }} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Cards</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Left Fencer</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAddCard('left', 'yellow')}
                      className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 py-2 px-4 rounded-lg transition-colors"
                    >
                      Yellow Card
                    </button>
                    <button
                      onClick={() => onAddCard('left', 'red')}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 py-2 px-4 rounded-lg transition-colors"
                    >
                      Red Card
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Right Fencer</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAddCard('right', 'yellow')}
                      className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 py-2 px-4 rounded-lg transition-colors"
                    >
                      Yellow Card
                    </button>
                    <button
                      onClick={() => onAddCard('right', 'red')}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 py-2 px-4 rounded-lg transition-colors"
                    >
                      Red Card
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isEliminationMatch && (
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Passivity Cards (Both Fencers)</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAddPassivityCards('pYellow')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      hasYellowPassivityCard
                        ? 'bg-yellow-500 text-black'
                        : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500'
                    }`}
                  >
                    P-Yellow
                  </button>
                  <button
                    onClick={() => onAddPassivityCards('pRed')}
                    disabled={!hasYellowPassivityCard}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      hasRedPassivityCard
                        ? 'bg-red-500 text-white'
                        : hasYellowPassivityCard
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-500'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    P-Red
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;