import React, { useState, useEffect, useCallback } from 'react';
import ScorePanel from './ScorePanel';
import TimerDisplay from './TimerDisplay';
import ControlButton from './ControlButton';
import SwapButton from './SwapButton';
import PeriodIndicator from './PeriodIndicator';
import PriorityIndicator from './PriorityIndicator';
import BoutIndicator from './BoutIndicator';
import ResetDrawer from './ResetDrawer';
import SettingsDrawer from './SettingsDrawer';
import PriorityAssignmentModal from './PriorityAssignmentModal';
import { MatchType, ScoreboardState, Card, PassivityCard } from '../types';
import { Settings } from 'lucide-react';
import { useWakeLock } from '../hooks/useWakeLock';

const POOL_CONFIG = {
  maxTime: 180, // 3 minutes in seconds
  maxScore: 5,
  periods: 1
};

const ELIMINATION_CONFIG = {
  maxTime: 180, // 3 minutes in seconds
  breakTime: 60, // 1 minute break
  maxScore: 15,
  periods: 3
};

const OVERTIME_CONFIG = {
  maxTime: 60, // 1 minute in seconds
};

const Scoreboard: React.FC = () => {
  const [state, setState] = useState<ScoreboardState>({
    leftFencer: {
      score: 0,
      cards: [],
      passivityCards: []
    },
    rightFencer: {
      score: 0,
      cards: [],
      passivityCards: []
    },
    timeRemaining: POOL_CONFIG.maxTime,
    isRunning: false,
    matchType: 'pool',
    currentPeriod: 1,
    maxTime: POOL_CONFIG.maxTime,
    maxScore: POOL_CONFIG.maxScore,
    isBreak: false,
    isOvertime: false,
    prioritySide: null,
    showPriorityAssignment: false
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showResetDrawer, setShowResetDrawer] = useState(false);
  
  useWakeLock(state.isRunning);

  useEffect(() => {
    let timer: number | undefined;
    
    if (state.isRunning && state.timeRemaining > 0) {
      timer = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (state.timeRemaining === 0) {
      setState(prev => {
        // Check if scores are tied and we need overtime
        const scoresAreTied = prev.leftFencer.score === prev.rightFencer.score;
        
        if (prev.isOvertime) {
          // Overtime ended - if still tied, fencer with priority wins
          return {
            ...prev,
            isRunning: false
          };
        }
        
        if (prev.matchType === 'elimination' && prev.currentPeriod < 3) {
          if (prev.isBreak) {
            // After break, start next period
            return {
              ...prev,
              isRunning: false,
              isBreak: false,
              currentPeriod: prev.currentPeriod + 1,
              timeRemaining: ELIMINATION_CONFIG.maxTime
            };
          } else {
            // Start break
            return {
              ...prev,
              isRunning: false,
              isBreak: true,
              timeRemaining: ELIMINATION_CONFIG.breakTime
            };
          }
        } else if (scoresAreTied && !prev.isOvertime) {
          // Scores are tied at end of regulation - show priority assignment
          return {
            ...prev,
            isRunning: false,
            showPriorityAssignment: true
          };
        } else {
          // End of match
          return {
            ...prev,
            isRunning: false
          };
        }
      });
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isRunning, state.timeRemaining]);

  const handleStartPause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  }, []);

  const handleResetTime = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeRemaining: prev.isOvertime ? OVERTIME_CONFIG.maxTime : prev.maxTime,
      isRunning: false,
      isBreak: false,
      currentPeriod: prev.isOvertime ? prev.currentPeriod : 1
    }));
  }, []);

  const handleResetScore = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: { ...prev.leftFencer, score: 0 },
      rightFencer: { ...prev.rightFencer, score: 0 }
    }));
  }, []);

  const handleResetCards = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: { ...prev.leftFencer, cards: [], passivityCards: [] },
      rightFencer: { ...prev.rightFencer, cards: [], passivityCards: [] }
    }));
  }, []);

  const handleResetAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: { score: 0, cards: [], passivityCards: [] },
      rightFencer: { score: 0, cards: [], passivityCards: [] },
      timeRemaining: prev.maxTime,
      isRunning: false,
      currentPeriod: 1,
      isBreak: false,
      isOvertime: false,
      prioritySide: null,
      showPriorityAssignment: false
    }));
  }, []);

  const handleSwap = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: prev.rightFencer,
      rightFencer: prev.leftFencer,
      prioritySide: prev.prioritySide === 'left' ? 'right' : prev.prioritySide === 'right' ? 'left' : null
    }));
  }, []);

  const handleMatchTypeChange = useCallback((type: MatchType) => {
    const config = type === 'pool' ? POOL_CONFIG : ELIMINATION_CONFIG;
    
    setState(prev => ({
      ...prev,
      matchType: type,
      maxScore: config.maxScore,
      maxTime: config.maxTime,
      timeRemaining: config.maxTime,
      leftFencer: { score: 0, cards: [], passivityCards: [] },
      rightFencer: { score: 0, cards: [], passivityCards: [] },
      currentPeriod: 1,
      isRunning: false,
      isBreak: false,
      isOvertime: false,
      prioritySide: null,
      showPriorityAssignment: false
    }));
  }, []);

  const handleTimeChange = useCallback((newTime: number) => {
    setState(prev => ({
      ...prev,
      timeRemaining: newTime
    }));
  }, []);

  const handleAddCard = useCallback((side: 'left' | 'right', card: Card) => {
    setState(prev => {
      const fencer = side === 'left' ? 'leftFencer' : 'rightFencer';
      const hasCard = prev[fencer].cards.includes(card);

      // If yellow card already exists, remove it
      if (hasCard && card === 'yellow') {
        return {
          ...prev,
          [fencer]: {
            ...prev[fencer],
            cards: prev[fencer].cards.filter(c => c !== card)
          }
        };
      }

      // If yellow card doesn't exist yet, add it
      if (!hasCard && card === 'yellow') {
        return {
          ...prev,
          [fencer]: {
            ...prev[fencer],
            cards: [...prev[fencer].cards, card]
          }
        };
      }

      // For red cards, always add them
      if (card === 'red') {
        return {
          ...prev,
          [fencer]: {
            ...prev[fencer],
            cards: [...prev[fencer].cards, card]
          }
        };
      }

      return prev;
    });
  }, []);

  const handleAddPassivityCards = useCallback((card: PassivityCard) => {
    setState(prev => {
      // Only allow passivity cards in elimination matches
      if (prev.matchType !== 'elimination') {
        return prev;
      }

      // If the card already exists, remove it
      if (prev.leftFencer.passivityCards.includes(card)) {
        // If removing yellow, also remove red
        const cardsToRemove = card === 'pYellow' ? ['pYellow', 'pRed'] : [card];
        return {
          ...prev,
          leftFencer: {
            ...prev.leftFencer,
            passivityCards: prev.leftFencer.passivityCards.filter(c => !cardsToRemove.includes(c))
          },
          rightFencer: {
            ...prev.rightFencer,
            passivityCards: prev.rightFencer.passivityCards.filter(c => !cardsToRemove.includes(c))
          }
        };
      }
      
      // If trying to add red without yellow, do nothing
      if (card === 'pRed' && !prev.leftFencer.passivityCards.includes('pYellow')) {
        return prev;
      }

      // Add the new card
      return {
        ...prev,
        leftFencer: {
          ...prev.leftFencer,
          passivityCards: [...prev.leftFencer.passivityCards, card]
        },
        rightFencer: {
          ...prev.rightFencer,
          passivityCards: [...prev.rightFencer.passivityCards, card]
        }
      };
    });
  }, []);

  const handleLeftScoreChange = useCallback((score: number) => {
    setState(prev => ({
      ...prev,
      leftFencer: { ...prev.leftFencer, score }
    }));
  }, []);

  const handleRightScoreChange = useCallback((score: number) => {
    setState(prev => ({
      ...prev,
      rightFencer: { ...prev.rightFencer, score }
    }));
  }, []);

  const handlePriorityAssignment = useCallback((side: 'left' | 'right') => {
    setState(prev => ({
      ...prev,
      prioritySide: side,
      isOvertime: true,
      timeRemaining: OVERTIME_CONFIG.maxTime,
      showPriorityAssignment: false
    }));
  }, []);

  const hasYellowPassivityCard = state.leftFencer.passivityCards.includes('pYellow');
  const hasRedPassivityCard = state.leftFencer.passivityCards.includes('pRed');
  const isEliminationMatch = state.matchType === 'elimination';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-4 sm:p-6">
      <div className="w-full flex justify-end items-center mb-2">
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>
      
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full mb-8">
          <ScorePanel 
            side="left"
            score={state.leftFencer.score} 
            maxScore={state.maxScore}
            cards={state.leftFencer.cards}
            passivityCards={state.leftFencer.passivityCards}
            onScoreChange={handleLeftScoreChange} 
          />
          
          <div className="flex flex-col items-center">
            <SwapButton onClick={handleSwap} />
          </div>
          
          <ScorePanel 
            side="right"
            score={state.rightFencer.score} 
            maxScore={state.maxScore}
            cards={state.rightFencer.cards}
            passivityCards={state.rightFencer.passivityCards}
            onScoreChange={handleRightScoreChange} 
          />
        </div>
        
        <PriorityIndicator 
          prioritySide={state.prioritySide}
          isOvertime={state.isOvertime}
        />
        
        <BoutIndicator 
          isOvertime={state.isOvertime}
          matchType={state.matchType}
          currentPeriod={state.currentPeriod}
          isBreak={state.isBreak}
        />
        
        <TimerDisplay timeRemaining={state.timeRemaining} />
        
        <PeriodIndicator 
          currentPeriod={state.currentPeriod} 
          totalPeriods={state.matchType === 'elimination' ? 3 : 1}
          matchType={state.matchType}
          isBreak={state.isBreak}
          isOvertime={state.isOvertime}
        />
        
        <div className="mt-12 flex flex-col items-center space-y-6">
          <ControlButton 
            type="start" 
            onClick={handleStartPause}
            isRunning={state.isRunning}
          />
          <ControlButton 
            type="reset" 
            onClick={() => setShowResetDrawer(true)} 
          />
        </div>
      </div>

      <ResetDrawer
        isOpen={showResetDrawer}
        onClose={() => setShowResetDrawer(false)}
        onResetTime={handleResetTime}
        onResetScore={handleResetScore}
        onResetCards={handleResetCards}
        onResetAll={handleResetAll}
      />

      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        matchType={state.matchType}
        onMatchTypeChange={handleMatchTypeChange}
        onAddCard={handleAddCard}
        onAddPassivityCards={handleAddPassivityCards}
        hasYellowPassivityCard={hasYellowPassivityCard}
        hasRedPassivityCard={hasRedPassivityCard}
        isEliminationMatch={isEliminationMatch}
        timeRemaining={state.timeRemaining}
        onTimeChange={handleTimeChange}
      />

      <PriorityAssignmentModal
        isOpen={state.showPriorityAssignment}
        onClose={() => setState(prev => ({ ...prev, showPriorityAssignment: false }))}
        onAssignPriority={handlePriorityAssignment}
      />
    </div>
  );
};

export default Scoreboard;