export interface RaceRound {
  roundNumber: number;
  winnerId: string;
  points: number; // points earned this round (e.g. 1 normal, 2 gammon, 3 backgammon)
}

export interface RaceScore {
  id: string;
  type: 'race';
  sessionId: string;
  rounds: RaceRound[];
  scores: Record<string, number>; // playerId -> cumulative points
  winnerId: string | null;
  targetScore: number;
}

export interface ScoringRound {
  roundNumber: number;
  scores: Record<string, number>; // playerId -> points this round
}

export interface RoundBasedScore {
  id: string;
  type: 'round_based';
  sessionId: string;
  rounds: ScoringRound[];
  finalTotals: Record<string, number>; // playerId -> total points
}

export interface WinLossScore {
  id: string;
  type: 'win_loss';
  sessionId: string;
  winnerId: string;
  loserId?: string; // "shithead" / last place
  placements: string[]; // ordered player IDs, winner first
}

export interface FinalScoreResult {
  id: string;
  type: 'final_score';
  sessionId: string;
  scores: Record<string, number>; // playerId -> final points
}

export interface EloScore {
  id: string;
  type: 'elo';
  sessionId: string;
  result: 'player1_win' | 'player2_win' | 'draw';
  playerResults: Record<string, {
    outcome: 'win' | 'loss' | 'draw';
    ratingBefore: number;
    ratingAfter: number;
  }>;
}

export interface CooperativeScore {
  id: string;
  type: 'cooperative';
  sessionId: string;
  levelReached: number;
  won: boolean; // did the team complete the game?
  notes?: string;
}

export type ScoreData = RaceScore | RoundBasedScore | WinLossScore | FinalScoreResult | EloScore | CooperativeScore;
