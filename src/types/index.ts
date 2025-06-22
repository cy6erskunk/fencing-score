export type MatchType = 'pool' | 'elimination' | 'team' | 'freeform';
export type Card = 'yellow' | 'red';
export type PassivityCard = 'pYellow' | 'pRed';

export interface PlayerState {
  score: number;
  cards: Card[];
  passivityCards: PassivityCard[];
}

export interface QRMatchData {
  matchId: string;
  player1: string;
  player2: string;
  tournamentId: number;
  round: number;
  submitUrl: string;
}

export interface QRMatchResult {
  matchId: string;
  player1_hits: number;
  player2_hits: number;
  winner: string;
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
  qrMatchData?: QRMatchData;
  leftFencerName?: string;
  rightFencerName?: string;
}