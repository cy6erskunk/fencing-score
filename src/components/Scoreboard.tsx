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
import QRScannerModal from './QRScannerModal';
import DeviceRegistrationModal from './DeviceRegistrationModal';
import { MatchType, ScoreboardState, Card, PassivityCard, QRMatchData, QRMatchResult } from '../types';
import { Settings, QrCode, Send } from 'lucide-react';
import { useWakeLock } from '../hooks/useWakeLock';
import { submitMatchResult, registerDevice } from '../utils/api';
import { getToken, saveToken, getDeviceName, removeToken } from '../utils/tokenStorage';

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

const TEAM_CONFIG = {
  maxTime: 180, // 3 minutes in seconds
  totalBouts: 9,
  getMaxScore: (bout: number) => bout * 5 // Bout 1: 5pts, Bout 2: 10pts, etc.
};

const FREEFORM_CONFIG = {
  maxTime: 180, // 3 minutes in seconds
  maxScore: 999, // No practical limit
  periods: 1
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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showDeviceRegistration, setShowDeviceRegistration] = useState(false);
  const [pendingQRData, setPendingQRData] = useState<QRMatchData | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  useWakeLock(state.isRunning);

  // Load device name on mount
  useEffect(() => {
    const name = getDeviceName();
    const token = getToken();

    // If we have a token but no name (old registration), show a default name
    if (token && !name) {
      setDeviceName('Registered Device');
    } else {
      setDeviceName(name);
    }
  }, []);

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
        
        if (prev.matchType === 'team') {
          // Team event logic
          if (prev.currentPeriod === 9 && scoresAreTied) {
            // Final bout ended with tied scores - show priority assignment for sudden death
            return {
              ...prev,
              isRunning: false,
              showPriorityAssignment: true
            };
          } else {
            // Regular bout ended - just stop the timer
            return {
              ...prev,
              isRunning: false
            };
          }
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
        } else if (scoresAreTied && !prev.isOvertime && (prev.matchType === 'elimination' || prev.matchType === 'freeform')) {
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
    let config;
    
    if (type === 'pool') {
      config = POOL_CONFIG;
    } else if (type === 'elimination') {
      config = ELIMINATION_CONFIG;
    } else if (type === 'team') {
      config = {
        maxTime: TEAM_CONFIG.maxTime,
        maxScore: TEAM_CONFIG.getMaxScore(1),
        periods: 1
      };
    } else { // freeform
      config = FREEFORM_CONFIG;
    }
    
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
      // Only allow passivity cards in elimination and team matches
      if (prev.matchType === 'pool' || prev.matchType === 'freeform') {
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

  const handleShowPriorityAssignment = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPriorityAssignment: true
    }));
  }, []);

  const handleNextBout = useCallback(() => {
    setState(prev => {
      if (prev.matchType !== 'team' || prev.currentPeriod >= 9) {
        return prev;
      }

      const nextBout = prev.currentPeriod + 1;
      const newMaxScore = TEAM_CONFIG.getMaxScore(nextBout);

      return {
        ...prev,
        currentPeriod: nextBout,
        maxScore: newMaxScore,
        timeRemaining: TEAM_CONFIG.maxTime,
        isRunning: false,
        // Reset yellow/red cards but keep passivity cards
        leftFencer: {
          ...prev.leftFencer,
          cards: []
        },
        rightFencer: {
          ...prev.rightFencer,
          cards: []
        },
        isOvertime: false,
        prioritySide: null
      };
    });
  }, []);

  const handleQRScanSuccess = useCallback((qrData: QRMatchData) => {
    setShowQRScanner(false);

    // Check if submitter identity is required and if we have a token
    if (qrData.requireSubmitterIdentity) {
      const existingToken = getToken();

      if (!existingToken) {
        // Show registration modal
        setPendingQRData(qrData);
        setShowDeviceRegistration(true);
        setRegistrationError(null);
        return;
      }
    }

    // Load match data (either no registration required or we have a token)
    setState(prev => ({
      ...prev,
      qrMatchData: qrData,
      leftFencerName: qrData.player1,
      rightFencerName: qrData.player2,
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
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  const handleQRScanError = useCallback((error: string) => {
    console.error('QR Scan Error:', error);
    setSubmitError(error);
  }, []);

  const handleDeviceRegistration = useCallback(async (name: string) => {
    if (!pendingQRData) {
      setRegistrationError('Invalid tournament configuration');
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const response = await registerDevice(pendingQRData.baseUri, {
        name
      });

      // Save the device token and name
      saveToken(response.deviceToken, name);
      setDeviceName(name);

      // Close registration modal and load match data
      setShowDeviceRegistration(false);
      setState(prev => ({
        ...prev,
        qrMatchData: pendingQRData,
        leftFencerName: pendingQRData.player1,
        rightFencerName: pendingQRData.player2,
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
      setPendingQRData(null);
      setSubmitError(null);
      setSubmitSuccess(false);
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Failed to register device');
    } finally {
      setIsRegistering(false);
    }
  }, [pendingQRData]);

  const handleSubmitResult = useCallback(async () => {
    if (!state.qrMatchData) return;

    const winner = state.leftFencer.score > state.rightFencer.score
      ? state.qrMatchData.player1
      : state.rightFencer.score > state.leftFencer.score
      ? state.qrMatchData.player2
      : 'tie';

    const result: QRMatchResult = {
      matchId: state.qrMatchData.matchId,
      player1_hits: state.leftFencer.score,
      player2_hits: state.rightFencer.score,
      winner
    };

    // Add device token if submitter identity is required
    if (state.qrMatchData.requireSubmitterIdentity) {
      const deviceToken = getToken();
      if (deviceToken) {
        result.deviceToken = deviceToken;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitMatchResult(state.qrMatchData.submitUrl, result);
      setSubmitSuccess(true);

      // Clear QR match data after successful submission
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          qrMatchData: undefined,
          leftFencerName: undefined,
          rightFencerName: undefined
        }));
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit result');
    } finally {
      setIsSubmitting(false);
    }
  }, [state.qrMatchData, state.leftFencer.score, state.rightFencer.score]);

  const handleClearIdentity = useCallback(() => {
    removeToken();
    setDeviceName(null);
  }, []);

  const hasYellowPassivityCard = state.leftFencer.passivityCards.includes('pYellow');
  const hasRedPassivityCard = state.leftFencer.passivityCards.includes('pRed');
  const isEliminationMatch = state.matchType === 'elimination';
  const isTeamMatch = state.matchType === 'team';
  const isFreeformMatch = state.matchType === 'freeform';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-4 sm:p-6">
      <div className="w-full flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowQRScanner(true)}
            className="p-2 text-cyan-400 hover:text-cyan-300 rounded-full transition-colors"
            aria-label="Scan QR Code"
          >
            <QrCode size={24} />
          </button>
          {state.qrMatchData && (
            <button 
              onClick={handleSubmitResult}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              <Send size={16} />
              {isSubmitting ? 'Submitting...' : 'Submit Result'}
            </button>
          )}
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
      </div>
      
      {state.qrMatchData && (
        <div className="w-full max-w-2xl mb-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
          <div className="text-center">
            <div className="text-cyan-400 text-sm mb-1">Tournament Match</div>
            <div className="text-white font-bold">{state.leftFencerName} vs {state.rightFencerName}</div>
            <div className="text-gray-400 text-xs mt-1">Round {state.qrMatchData.round}</div>
          </div>
        </div>
      )}
      
      {submitSuccess && (
        <div className="w-full max-w-2xl mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-center text-green-400">
          Result submitted successfully!
        </div>
      )}
      
      {submitError && (
        <div className="w-full max-w-2xl mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-center text-red-400">
          Error: {submitError}
        </div>
      )}
      
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full mb-8">
          <ScorePanel 
            side="left"
            score={state.leftFencer.score} 
            maxScore={state.maxScore}
            cards={state.leftFencer.cards}
            passivityCards={state.leftFencer.passivityCards}
            onScoreChange={handleLeftScoreChange}
            fencerName={state.leftFencerName}
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
            fencerName={state.rightFencerName}
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
        
        <div className="pt-10 flex flex-col items-center space-y-6">
          <ControlButton 
            type="start" 
            onClick={handleStartPause}
            isRunning={state.isRunning}
          />
          <div className="flex space-x-4">
            <ControlButton 
              type="reset" 
              onClick={() => setShowResetDrawer(true)} 
            />
            {isTeamMatch && state.currentPeriod < 9 && (
              <button
                onClick={handleNextBout}
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-2 border-purple-500/50 py-3 px-8 rounded-lg text-xl font-bold transition-all duration-200"
              >
                Next Bout
              </button>
            )}
          </div>
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
        isTeamMatch={isTeamMatch}
        timeRemaining={state.timeRemaining}
        onTimeChange={handleTimeChange}
        onShowPriorityAssignment={isFreeformMatch ? handleShowPriorityAssignment : undefined}
        deviceName={deviceName}
        onClearIdentity={handleClearIdentity}
      />

      <PriorityAssignmentModal
        isOpen={state.showPriorityAssignment}
        onClose={() => setState(prev => ({ ...prev, showPriorityAssignment: false }))}
        onAssignPriority={handlePriorityAssignment}
      />
      
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
        onScanError={handleQRScanError}
      />

      <DeviceRegistrationModal
        isOpen={showDeviceRegistration}
        onClose={() => {
          setShowDeviceRegistration(false);
          setPendingQRData(null);
          setRegistrationError(null);
        }}
        onRegister={handleDeviceRegistration}
        isRegistering={isRegistering}
        error={registrationError || undefined}
      />
    </div>
  );
};

export default Scoreboard;