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
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  matchType,
  onMatchTypeChange,
  onAddCard,
  onAddPassivityCards,
}) => {
  if (!isOpen) return null;

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

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Passivity Cards (Both Fencers)</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAddPassivityCards('pYellow')}
                  className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 py-2 px-4 rounded-lg transition-colors"
                >
                  P-Yellow
                </button>
                <button
                  onClick={() => onAddPassivityCards('pRed')}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 py-2 px-4 rounded-lg transition-colors"
                >
                  P-Red
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer