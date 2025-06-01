import React, { useState, useEffect, useCallback } from 'react';
import ScorePanel from './ScorePanel';
import TimerDisplay from './TimerDisplay';
import ControlButton from './ControlButton';
import SwapButton from './SwapButton';
import PeriodIndicator from './PeriodIndicator';
import ResetDrawer from './ResetDrawer';
import SettingsDrawer from './SettingsDrawer';
import { MatchType, ScoreboardState, Card, PassivityCard } from '../types';
import { Settings } from 'lucide-react';

const POOL_CONFIG = {
  maxTime: 180, // 3 minutes in seconds
  maxScore: 5,
  periods: 1
};

const ELIMINATION_CONFIG = {
  maxTime: 180, // 3 minutes in seconds
  maxScore: 15,
  periods: 3
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
    maxScore: POOL_CONFIG.maxScore
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showResetDrawer, setShowResetDrawer] = useState(false);

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
      setState(prev => ({
        ...prev,
        isRunning: false
      }));
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isRunning, state.timeRemaining]);

  useEffect(() => {
    const { leftFencer, rightFencer, maxScore, isRunning } = state;
    
    if (isRunning && (leftFencer.score >= maxScore || rightFencer.score >= maxScore)) {
      setState(prev => ({
        ...prev,
        isRunning: false
      }));
    }
  }, [state.leftFencer.score, state.rightFencer.score, state.maxScore, state.isRunning]);

  const handleStartPause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  }, []);

  const handleResetTime = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeRemaining: prev.maxTime,
      isRunning: false
    }));
  }, []);

  const handleResetScore = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: { ...prev.leftFencer, score: 0 },
      rightFencer: { ...prev.rightFencer, score: 0 }
    }));
  }, []);

  const handleResetAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: { score: 0, cards: [], passivityCards: [] },
      rightFencer: { score: 0, cards: [], passivityCards: [] },
      timeRemaining: prev.maxTime,
      isRunning: false,
      currentPeriod: 1
    }));
  }, []);

  const handleSwap = useCallback(() => {
    setState(prev => ({
      ...prev,
      leftFencer: prev.rightFencer,
      rightFencer: prev.leftFencer
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
      isRunning: false
    }));
  }, []);

  const handleAddCard = useCallback((side: 'left' | 'right', card: Card) => {
    setState(prev => ({
      ...prev,
      [side === 'left' ? 'leftFencer' : 'rightFencer']: {
        ...prev[side === 'left' ? 'leftFencer' : 'rightFencer'],
        cards: [...prev[side === 'left' ? 'leftFencer' : 'rightFencer'].cards, card]
      }
    }));
  }, []);

  const handleAddPassivityCards = useCallback((card: PassivityCard) => {
    setState(prev => ({
      ...prev,
      leftFencer: {
        ...prev.leftFencer,
        passivityCards: [...prev.leftFencer.passivityCards, card]
      },
      rightFencer: {
        ...prev.rightFencer,
        passivityCards: [...prev.rightFencer.passivityCards, card]
      }
    }));
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
        
        <TimerDisplay timeRemaining={state.timeRemaining} />
        
        <PeriodIndicator 
          currentPeriod={state.currentPeriod} 
          totalPeriods={state.matchType === 'elimination' ? 3 : 1}
          matchType={state.matchType}
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
        onResetAll={handleResetAll}
      />

      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        matchType={state.matchType}
        onMatchTypeChange={handleMatchTypeChange}
        onAddCard={handleAddCard}
        onAddPassivityCards={handleAddPassivityCards}
      />
    </div>
  );
};

export default Scoreboard