export type MatchType = 'pool' | 'elimination' | 'team' | 'freeform';
export type Card = 'yellow' | 'red';
export type PassivityCard = 'pYellow' | 'pRed';

export interface PlayerState {
  score: number;
  cards: Card[];
  passivityCards: PassivityCard[];
}

export interface ScoreboardState {
  leftFencer: PlayerState;
  rightFencer: PlayerState;
  timeRemaining: number;
  isRunning: boolean;
  matchType: MatchType;
  currentPeriod: number;
  maxTime: number;
  maxScore: number;
  isBreak: boolean;
  isOvertime: boolean;
  prioritySide: 'left' | 'right' | null;
  showPriorityAssignment: boolean;
  currentBout?: number;
}