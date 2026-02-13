import { db } from '@/lib/db/database';
import type { ScoreData, WinLossScore, FinalScoreResult, RaceScore, RoundBasedScore, EloScore } from '@/lib/models/score';
import type { Game } from '@/lib/models/game';

function getWinnerId(score: ScoreData, game: Game): string | null {
  switch (score.type) {
    case 'win_loss':
      return (score as WinLossScore).winnerId;
    case 'final_score': {
      const s = score as FinalScoreResult;
      const sorted = Object.entries(s.scores).sort(([, a], [, b]) => b - a);
      return sorted[0]?.[0] ?? null;
    }
    case 'race':
      return (score as RaceScore).winnerId;
    case 'round_based': {
      const s = score as RoundBasedScore;
      const sorted = Object.entries(s.finalTotals).sort(([, a], [, b]) =>
        game.config.lowestWins ? a - b : b - a
      );
      return sorted[0]?.[0] ?? null;
    }
    case 'elo': {
      const s = score as EloScore;
      const winner = Object.entries(s.playerResults).find(([, r]) => r.outcome === 'win');
      return winner?.[0] ?? null;
    }
    default:
      return null;
  }
}

export interface PerGameStat {
  gameId: string;
  gameName: string;
  gameIcon: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

export interface PlayerProfileStats {
  totalGames: number;
  totalWins: number;
  overallWinRate: number;
  perGame: PerGameStat[];
  bestGame: PerGameStat | null;
  worstGame: PerGameStat | null;
  recentForm: boolean[]; // last 10 games, true = win
  currentStreak: number; // positive = wins, negative = losses
}

export async function computePlayerStats(playerId: string): Promise<PlayerProfileStats> {
  const sessions = await db.sessions
    .filter((s) => s.status === 'completed' && s.playerIds.includes(playerId))
    .sortBy('completedAt');
  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));

  let totalWins = 0;
  const perGameMap = new Map<string, { wins: number; played: number }>();
  const results: boolean[] = [];

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;

    const winnerId = getWinnerId(score, game);
    const isWin = winnerId === playerId;
    if (isWin) totalWins++;
    results.push(isWin);

    const gs = perGameMap.get(session.gameId) ?? { wins: 0, played: 0 };
    gs.played++;
    if (isWin) gs.wins++;
    perGameMap.set(session.gameId, gs);
  }

  const perGame: PerGameStat[] = Array.from(perGameMap.entries())
    .map(([gameId, stats]) => {
      const game = gameMap.get(gameId);
      return {
        gameId,
        gameName: game?.name ?? 'Unknown',
        gameIcon: game?.icon ?? '?',
        gamesPlayed: stats.played,
        wins: stats.wins,
        winRate: stats.played > 0 ? stats.wins / stats.played : 0,
      };
    })
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed);

  // Best/worst games (min 2 games played)
  const qualified = perGame.filter((g) => g.gamesPlayed >= 2);
  const bestGame = qualified.length > 0
    ? qualified.reduce((a, b) => (a.winRate > b.winRate ? a : b))
    : null;
  const worstGame = qualified.length > 0
    ? qualified.reduce((a, b) => (a.winRate < b.winRate ? a : b))
    : null;

  // Recent form (last 10)
  const recentForm = results.slice(-10);

  // Current streak
  let currentStreak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (i === results.length - 1) {
      currentStreak = results[i] ? 1 : -1;
    } else if (results[i] === results[results.length - 1]) {
      currentStreak += results[i] ? 1 : -1;
    } else {
      break;
    }
  }

  return {
    totalGames: sessions.length,
    totalWins,
    overallWinRate: sessions.length > 0 ? totalWins / sessions.length : 0,
    perGame,
    bestGame,
    worstGame: worstGame !== bestGame ? worstGame : null,
    recentForm,
    currentStreak,
  };
}
