import { ScoringType, type GameConfig, GameCategory } from '@/lib/models/game';

export const AFFILIATE_TAG = 'gameboard-20';

interface DefaultGameDef {
  name: string;
  scoringType: ScoringType;
  icon: string;
  config: GameConfig;
  category: GameCategory;
  youtubeVideoId?: string;
  amazonUrl?: string;
}

function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

export const DEFAULT_GAMES: DefaultGameDef[] = [
  // ──────────────────────────────────────────
  // CLASSIC / ABSTRACT
  // ──────────────────────────────────────────
  {
    name: 'Backgammon',
    scoringType: ScoringType.RACE,
    icon: '🎲',
    config: { minPlayers: 2, maxPlayers: 2, targetScore: 3 },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'xXE5AwzNQ2s',
    amazonUrl: amazonUrl('B0BWVMRQV3'),
  },
  {
    name: 'Chess',
    scoringType: ScoringType.ELO,
    icon: '♟️',
    config: { minPlayers: 2, maxPlayers: 2, allowDraw: true },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'NAIQyoPcjNM',
    amazonUrl: amazonUrl('B07B6GF9GY'),
  },
  {
    name: 'Checkers',
    scoringType: ScoringType.ELO,
    icon: '⬛',
    config: { minPlayers: 2, maxPlayers: 2, allowDraw: true },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'MOW9k_C4vFU',
    amazonUrl: amazonUrl('B08GGDNLZH'),
  },
  {
    name: 'Go',
    scoringType: ScoringType.ELO,
    icon: '⚫',
    config: { minPlayers: 2, maxPlayers: 2, allowDraw: false },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'Jq5SObMdV3o',
    amazonUrl: amazonUrl('B07K76MN2P'),
  },
  {
    name: 'Connect 4',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🔴',
    config: { minPlayers: 2, maxPlayers: 2 },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'utXzIFEVPjA',
    amazonUrl: amazonUrl('B09BMPJKP8'),
  },
  {
    name: 'Scrabble',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🔤',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'swlg3vQXboE',
    amazonUrl: amazonUrl('B00IL5PH5C'),
  },
  {
    name: 'Darts',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🎯',
    config: { minPlayers: 2, maxPlayers: 8, lowestWins: true, targetScore: 501 },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'hjmC0b881q0',
    amazonUrl: amazonUrl('B08CVS6TZ1'),
  },
  {
    name: 'Patchwork',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🧵',
    config: { minPlayers: 2, maxPlayers: 2 },
    category: GameCategory.CLASSIC,
    youtubeVideoId: 'cwJHmdbTWbg',
    amazonUrl: amazonUrl('B00RCCAPPE'),
  },

  // ──────────────────────────────────────────
  // STRATEGY
  // ──────────────────────────────────────────
  {
    name: 'Wingspan',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🦅',
    config: { minPlayers: 1, maxPlayers: 5 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'lgDgcLI2B0U',
    amazonUrl: amazonUrl('B07YQ1XHJR'),
  },
  {
    name: 'Ticket to Ride',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🚂',
    config: { minPlayers: 2, maxPlayers: 5 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: '4JhFhyvGdik',
    amazonUrl: amazonUrl('B0002TV2LU'),
  },
  {
    name: 'Catan',
    scoringType: ScoringType.RACE,
    icon: '🏝️',
    config: { minPlayers: 3, maxPlayers: 4, targetScore: 10 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: '8Yj0Y3GKE40',
    amazonUrl: amazonUrl('B00U26V4VQ'),
  },
  {
    name: 'Carcassonne',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🏰',
    config: { minPlayers: 2, maxPlayers: 5 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'gX8jFLUw8D4',
    amazonUrl: amazonUrl('B00NX627HW'),
  },
  {
    name: 'Terraforming Mars',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🪐',
    config: { minPlayers: 1, maxPlayers: 5 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'n3yVpsiVwL8',
    amazonUrl: amazonUrl('B01GSYA4K2'),
  },
  {
    name: 'Azul',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🔷',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'csJL-78NEPQ',
    amazonUrl: amazonUrl('B077MZ2MPH'),
  },
  {
    name: '7 Wonders',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🏛️',
    config: { minPlayers: 3, maxPlayers: 7 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'z_Wfdn5Es8U',
    amazonUrl: amazonUrl('B08C2TNG8S'),
  },
  {
    name: 'Splendor',
    scoringType: ScoringType.RACE,
    icon: '💎',
    config: { minPlayers: 2, maxPlayers: 4, targetScore: 15 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'rue8-jvbc9I',
    amazonUrl: amazonUrl('B00IZEUFIA'),
  },
  {
    name: 'Dominion',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '👑',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: '5jNGpgdMums',
    amazonUrl: amazonUrl('B001JQY6P4'),
  },
  {
    name: 'Scythe',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '⚔️',
    config: { minPlayers: 1, maxPlayers: 5 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'ffMLIL5qGQg',
    amazonUrl: amazonUrl('B01IPUGYK6'),
  },
  {
    name: 'Root',
    scoringType: ScoringType.RACE,
    icon: '🦊',
    config: { minPlayers: 2, maxPlayers: 4, targetScore: 30 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'G08TDwBbV7o',
    amazonUrl: amazonUrl('B07MFNKY8K'),
  },
  {
    name: 'Cascadia',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🐻',
    config: { minPlayers: 1, maxPlayers: 4 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'w-r_TekunQI',
    amazonUrl: amazonUrl('B093H8RGXX'),
  },
  {
    name: 'Agricola',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🌾',
    config: { minPlayers: 1, maxPlayers: 4 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'LWuUuxbMDB0',
    amazonUrl: amazonUrl('B00BFIM4MQ'),
  },
  {
    name: 'Stone Age',
    scoringType: ScoringType.FINAL_SCORE,
    icon: '🪨',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'ltD3vYrrn_8',
    amazonUrl: amazonUrl('B0038O17RC'),
  },
  {
    name: 'King of Tokyo',
    scoringType: ScoringType.RACE,
    icon: '👹',
    config: { minPlayers: 2, maxPlayers: 6, targetScore: 20 },
    category: GameCategory.STRATEGY,
    youtubeVideoId: 'RWYGlPf6IzE',
    amazonUrl: amazonUrl('B004U5R5BI'),
  },

  // ──────────────────────────────────────────
  // PARTY
  // ──────────────────────────────────────────
  {
    name: 'Jungle Speed',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🪵',
    config: { minPlayers: 2, maxPlayers: 10 },
    category: GameCategory.PARTY,
    youtubeVideoId: 'iO_lJEz3GGw',
    amazonUrl: amazonUrl('B00003GCYJ'),
  },
  {
    name: 'Exploding Kittens',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🐱',
    config: { minPlayers: 2, maxPlayers: 5 },
    category: GameCategory.PARTY,
    youtubeVideoId: 'kAkRKuv5Rts',
    amazonUrl: amazonUrl('B010TQY7A8'),
  },
  {
    name: 'Codenames',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🕵️',
    config: { minPlayers: 4, maxPlayers: 8 },
    category: GameCategory.PARTY,
    youtubeVideoId: 'J8RWBooJivg',
    amazonUrl: amazonUrl('B014Q1XX9S'),
  },
  {
    name: 'Love Letter',
    scoringType: ScoringType.RACE,
    icon: '💌',
    config: { minPlayers: 2, maxPlayers: 6, targetScore: 7 },
    category: GameCategory.PARTY,
    youtubeVideoId: 'RiQ2To5KWJM',
    amazonUrl: amazonUrl('B07N4K6DSG'),
  },
  {
    name: 'The Chameleon',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🦎',
    config: { minPlayers: 3, maxPlayers: 8 },
    category: GameCategory.PARTY,
    youtubeVideoId: 'Tgn2W4KIanY',
    amazonUrl: amazonUrl('B073JQKF1P'),
  },
  {
    name: 'Sushi Go',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🍣',
    config: { minPlayers: 2, maxPlayers: 5 },
    category: GameCategory.PARTY,
    youtubeVideoId: 'oIutqhJTUgc',
    amazonUrl: amazonUrl('B00J57VU44'),
  },

  // ──────────────────────────────────────────
  // FAMILY
  // ──────────────────────────────────────────
  {
    name: 'Monopoly',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🏠',
    config: { minPlayers: 2, maxPlayers: 8 },
    category: GameCategory.FAMILY,
    youtubeVideoId: '4nz-_hvFw44',
    amazonUrl: amazonUrl('B0DN37BBGD'),
  },
  {
    name: 'Monopoly Deal',
    scoringType: ScoringType.WIN_LOSS,
    icon: '💰',
    config: { minPlayers: 2, maxPlayers: 5 },
    category: GameCategory.FAMILY,
    youtubeVideoId: 'Gc0XrTjmCV8',
    amazonUrl: amazonUrl('B00NQQTZCO'),
  },
  {
    name: 'Clue',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🔍',
    config: { minPlayers: 2, maxPlayers: 6 },
    category: GameCategory.FAMILY,
    youtubeVideoId: '5DGy0GBbMyA',
    amazonUrl: amazonUrl('B08DV6KZ9H'),
  },
  {
    name: 'Sequence',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🃏',
    config: { minPlayers: 2, maxPlayers: 12 },
    category: GameCategory.FAMILY,
    youtubeVideoId: 'LDttsej2d9o',
    amazonUrl: amazonUrl('B00DIACENI'),
  },
  {
    name: 'UNO',
    scoringType: ScoringType.WIN_LOSS,
    icon: '🟥',
    config: { minPlayers: 2, maxPlayers: 10 },
    category: GameCategory.FAMILY,
    youtubeVideoId: 'sWoSZmHsCls',
    amazonUrl: amazonUrl('B005I5M2F8'),
  },

  // ──────────────────────────────────────────
  // CARD GAMES
  // ──────────────────────────────────────────
  {
    name: 'Flip 7',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🃏',
    config: { minPlayers: 2, maxPlayers: 8, lowestWins: false, targetScore: 200 },
    category: GameCategory.CARD_GAMES,
  },
  {
    name: 'Palace',
    scoringType: ScoringType.WIN_LOSS,
    icon: '💩',
    config: { minPlayers: 2, maxPlayers: 6, trackLastPlace: true },
    category: GameCategory.CARD_GAMES,
    youtubeVideoId: 'JZ_Qd5KTy3k',
  },
  {
    name: 'Gin Rummy',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🂡',
    config: { minPlayers: 2, maxPlayers: 2, targetScore: 100 },
    category: GameCategory.CARD_GAMES,
    youtubeVideoId: 'Uy063oI9Gkk',
  },
  {
    name: 'Bridge',
    scoringType: ScoringType.ROUND_BASED,
    icon: '🂮',
    config: { minPlayers: 4, maxPlayers: 4 },
    category: GameCategory.CARD_GAMES,
    youtubeVideoId: 'Arq3t0iHfPE',
  },
  {
    name: 'Poker',
    scoringType: ScoringType.ROUND_BASED,
    icon: '♠️',
    config: { minPlayers: 2, maxPlayers: 10 },
    category: GameCategory.CARD_GAMES,
    youtubeVideoId: 'ep1riICX-KU',
    amazonUrl: amazonUrl('B09BNRJ6WY'),
  },

  // ──────────────────────────────────────────
  // COOPERATIVE
  // ──────────────────────────────────────────
  {
    name: 'The Mind',
    scoringType: ScoringType.COOPERATIVE,
    icon: '🧠',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.COOPERATIVE,
    youtubeVideoId: 'uXl8MC0GMYE',
    amazonUrl: amazonUrl('B07C4WWZDW'),
  },
  {
    name: 'Pandemic',
    scoringType: ScoringType.COOPERATIVE,
    icon: '🦠',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.COOPERATIVE,
    youtubeVideoId: 'ojkScPkdgsk',
    amazonUrl: amazonUrl('B00A2HD40E'),
  },
  {
    name: 'Hanabi',
    scoringType: ScoringType.COOPERATIVE,
    icon: '🎆',
    config: { minPlayers: 2, maxPlayers: 5 },
    category: GameCategory.COOPERATIVE,
    youtubeVideoId: 'd_js_3S_7K8',
    amazonUrl: amazonUrl('B00CYQ54LI'),
  },
  {
    name: 'Forbidden Island',
    scoringType: ScoringType.COOPERATIVE,
    icon: '🏝️',
    config: { minPlayers: 2, maxPlayers: 4 },
    category: GameCategory.COOPERATIVE,
    youtubeVideoId: 'S2GCP55_FOc',
    amazonUrl: amazonUrl('B003D7F4YY'),
  },
  {
    name: 'Gloomhaven',
    scoringType: ScoringType.COOPERATIVE,
    icon: '⚔️',
    config: { minPlayers: 1, maxPlayers: 4 },
    category: GameCategory.COOPERATIVE,
    youtubeVideoId: 'Uw7LI2esvp0',
    amazonUrl: amazonUrl('B01LZXVN4P'),
  },
  {
    name: 'Sky Team',
    scoringType: ScoringType.COOPERATIVE,
    icon: '✈️',
    config: { minPlayers: 2, maxPlayers: 2 },
    category: GameCategory.COOPERATIVE,
    youtubeVideoId: 'akX8WfuqUXo',
    amazonUrl: amazonUrl('B0CN85W67K'),
  },
];
