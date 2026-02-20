import { ScoringType, type GameConfig } from '@/lib/models/game';

interface DefaultGameDef {
  name: string;
  scoringType: ScoringType;
  icon: string;
  config: GameConfig;
}

export const DEFAULT_GAMES: DefaultGameDef[] = [
  {
    name: 'Backgammon',
    scoringType: ScoringType.RACE,
    icon: '🎲',
    config: { minPlayers: 2, maxPlayers: 2, targetScore: 3 },
  },
  {
    name: 'Flip 7',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🃏',
    config: { minPlayers: 2, maxPlayers: 8, lowestWins: false, targetScore: 200 },
  },
  {
    name: 'Monopoly Deal',
    scoringType: ScoringType.WIN_LOSS,
    icon: '💰',
    config: { minPlayers: 2, maxPlayers: 5 },
  },
  {
    name: 'Wingspan',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🦅',
    config: { minPlayers: 1, maxPlayers: 5 },
  },
  {
    name: 'Ticket to Ride',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🚂',
    config: { minPlayers: 2, maxPlayers: 5 },
  },
  {
    name: 'Shithead',
    scoringType: ScoringType.WIN_LOSS,
    icon: '💩',
    config: { minPlayers: 2, maxPlayers: 6, trackLastPlace: true },
  },
  {
    name: 'Chess',
    scoringType: ScoringType.ELO,
    icon: '♟️',
    config: { minPlayers: 2, maxPlayers: 2, allowDraw: true },
  },
  {
    name: 'The Mind',
    scoringType: ScoringType.COOPERATIVE,
    icon: '🧠',
    config: { minPlayers: 2, maxPlayers: 4 },
  },
  {
    name: 'Jungle Speed',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🪵',
    config: { minPlayers: 2, maxPlayers: 10 },
  },
  {
    name: 'Darts',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🎯',
    config: { minPlayers: 2, maxPlayers: 8, lowestWins: true, targetScore: 501 },
  },
];
