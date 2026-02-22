export enum ScoringType {
  RACE = 'race',
  ROUND_BASED = 'round_based',
  WIN_LOSS = 'win_loss',
  FINAL_SCORE = 'final_score',
  ELO = 'elo',
  COOPERATIVE = 'cooperative',
}

export enum GameCategory {
  STRATEGY = 'strategy',
  PARTY = 'party',
  FAMILY = 'family',
  CARD_GAMES = 'card_games',
  CLASSIC = 'classic',
  COOPERATIVE = 'cooperative',
}

export interface GameConfig {
  minPlayers: number;
  maxPlayers: number;
  targetScore?: number;
  trackLastPlace?: boolean;
  allowDraw?: boolean;
  lowestWins?: boolean;
}

export interface Game {
  id: string;
  name: string;
  scoringType: ScoringType;
  icon: string;
  config: GameConfig;
  isCustom: boolean;
  createdAt: Date;
  isFavourite?: boolean;
  category?: GameCategory;
  youtubeVideoId?: string;
  amazonUrl?: string;
}
