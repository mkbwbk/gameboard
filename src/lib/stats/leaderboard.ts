import { db } from '@/lib/db/database';
import type { Player } from '@/lib/models/player';
import type { ScoreData, WinLossScore, FinalScoreResult, RaceScore, RoundBasedScore, EloScore } from '@/lib/models/score';
import type { Game } from '@/lib/models/game';

export interface LeaderboardEntry {
  player: Player;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

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

export async function computeLeaderboard(gameId?: string): Promise<LeaderboardEntry[]> {
  const players = await db.players.toArray();
  const sessions = await db.sessions
    .filter((s) => s.status === 'completed' && (!gameId || s.gameId === gameId))
    .toArray();
  const scores = await db.scores.toArray();
  const games = await db.games.toArray();

  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));

  const playerStats = new Map<string, { played: number; wins: number }>();

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;

    const winnerId = getWinnerId(score, game);

    for (const playerId of session.playerIds) {
      const stats = playerStats.get(playerId) ?? { played: 0, wins: 0 };
      stats.played++;
      if (playerId === winnerId) stats.wins++;
      playerStats.set(playerId, stats);
    }
  }

  const entries: LeaderboardEntry[] = players
    .map((player) => {
      const stats = playerStats.get(player.id) ?? { played: 0, wins: 0 };
      return {
        player,
        gamesPlayed: stats.played,
        wins: stats.wins,
        winRate: stats.played > 0 ? stats.wins / stats.played : 0,
      };
    })
    .filter((e) => e.gamesPlayed > 0)
    .sort((a, b) => {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.wins - a.wins;
    });

  return entries;
}
