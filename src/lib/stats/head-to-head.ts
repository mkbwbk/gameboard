import { db } from '@/lib/db/database';
import type { ScoreData, WinLossScore, FinalScoreResult, RaceScore, RoundBasedScore, EloScore } from '@/lib/models/score';
import type { Game } from '@/lib/models/game';

export interface HeadToHeadRecord {
  player1Wins: number;
  player2Wins: number;
  draws: number;
  totalGames: number;
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

export async function computeHeadToHead(player1Id: string, player2Id: string): Promise<HeadToHeadRecord> {
  const sessions = await db.sessions
    .filter((s) =>
      s.status === 'completed' &&
      s.playerIds.includes(player1Id) &&
      s.playerIds.includes(player2Id)
    )
    .toArray();

  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));

  let player1Wins = 0;
  let player2Wins = 0;
  let draws = 0;

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;

    const winnerId = getWinnerId(score, game);
    if (winnerId === player1Id) player1Wins++;
    else if (winnerId === player2Id) player2Wins++;
    else draws++;
  }

  return {
    player1Wins,
    player2Wins,
    draws,
    totalGames: sessions.length,
  };
}
