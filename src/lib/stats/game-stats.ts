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

/** Win distribution per player for a specific game */
export async function computeGameWinDistribution(gameId: string): Promise<{
  name: string;
  emoji: string;
  wins: number;
  color: string;
}[]> {
  const sessions = await db.sessions
    .filter((s) => s.status === 'completed' && s.gameId === gameId)
    .toArray();
  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const players = await db.players.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));
  const playerMap = new Map(players.map((p) => [p.id, p]));

  const winCounts = new Map<string, number>();

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;
    const winnerId = getWinnerId(score, game);
    if (winnerId) {
      winCounts.set(winnerId, (winCounts.get(winnerId) ?? 0) + 1);
    }
  }

  return Array.from(winCounts.entries())
    .map(([playerId, wins]) => {
      const player = playerMap.get(playerId);
      return {
        name: player?.name ?? 'Unknown',
        emoji: player?.avatarEmoji ?? '?',
        wins,
        color: player?.avatarColor ?? '#888',
      };
    })
    .sort((a, b) => b.wins - a.wins);
}

/** Score history for a game (for score-based games) */
export async function computeGameScoreHistory(gameId: string): Promise<{
  session: number;
  scores: Record<string, number>;
}[]> {
  const sessions = await db.sessions
    .filter((s) => s.status === 'completed' && s.gameId === gameId)
    .sortBy('completedAt');
  const allScores = await db.scores.toArray();
  const scoreMap = new Map(allScores.map((s) => [s.sessionId, s]));

  const results: { session: number; scores: Record<string, number> }[] = [];

  sessions.forEach((session, index) => {
    const score = scoreMap.get(session.id);
    if (!score) return;

    const sessionScores: Record<string, number> = {};

    if (score.type === 'final_score') {
      const s = score as FinalScoreResult;
      Object.assign(sessionScores, s.scores);
    } else if (score.type === 'round_based') {
      const s = score as RoundBasedScore;
      Object.assign(sessionScores, s.finalTotals);
    } else if (score.type === 'race') {
      const s = score as RaceScore;
      Object.assign(sessionScores, s.scores);
    }

    if (Object.keys(sessionScores).length > 0) {
      results.push({ session: index + 1, scores: sessionScores });
    }
  });

  return results;
}
