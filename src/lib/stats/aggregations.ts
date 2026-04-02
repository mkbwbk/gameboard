import { db } from '@/lib/db/database';
import type { ScoreData, WinLossScore, FinalScoreResult, RaceScore, RoundBasedScore, EloScore, TeamsScore } from '@/lib/models/score';
import type { Game } from '@/lib/models/game';

function getWinnerIds(score: ScoreData, game: Game): string[] {
  switch (score.type) {
    case 'win_loss':
      return [(score as WinLossScore).winnerId];
    case 'final_score': {
      const s = score as FinalScoreResult;
      const sorted = Object.entries(s.scores).sort(([, a], [, b]) => b - a);
      return sorted[0] ? [sorted[0][0]] : [];
    }
    case 'race': {
      const winnerId = (score as RaceScore).winnerId;
      return winnerId ? [winnerId] : [];
    }
    case 'round_based': {
      const s = score as RoundBasedScore;
      const sorted = Object.entries(s.finalTotals).sort(([, a], [, b]) =>
        game.config.lowestWins ? a - b : b - a
      );
      return sorted[0] ? [sorted[0][0]] : [];
    }
    case 'elo': {
      const s = score as EloScore;
      const winner = Object.entries(s.playerResults).find(([, r]) => r.outcome === 'win');
      return winner ? [winner[0]] : [];
    }
    case 'teams': {
      const s = score as TeamsScore;
      return s.teams[s.winningTeamIndex]?.playerIds ?? [];
    }
    case 'cooperative':
      return []; // No individual winner
    default:
      return [];
  }
}

/** Weekly game frequency for the last N weeks */
export async function computeGamesPerWeek(weeks: number = 12): Promise<{ week: string; count: number }[]> {
  const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();

  const now = new Date();
  const result: { week: string; count: number }[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = sessions.filter((s) => {
      const d = new Date(s.completedAt ?? s.startedAt);
      return d >= weekStart && d < weekEnd;
    }).length;

    const label = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
    result.push({ week: label, count });
  }

  return result;
}

/** Win rate over time for a specific player (rolling window) */
export async function computeWinRateOverTime(
  playerId: string,
  windowSize: number = 5
): Promise<{ game: number; winRate: number }[]> {
  const sessions = await db.sessions
    .filter((s) => s.status === 'completed' && s.playerIds.includes(playerId))
    .sortBy('completedAt');

  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));

  const results: boolean[] = [];
  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;
    const winners = getWinnerIds(score, game);
    results.push(winners.includes(playerId));
  }

  if (results.length < 2) return [];

  const dataPoints: { game: number; winRate: number }[] = [];
  for (let i = 0; i < results.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = results.slice(start, i + 1);
    const wins = window.filter(Boolean).length;
    dataPoints.push({
      game: i + 1,
      winRate: Math.round((wins / window.length) * 100),
    });
  }

  return dataPoints;
}

/** Games played per game type */
export async function computeGameTypeDistribution(): Promise<{ name: string; icon: string; count: number }[]> {
  const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
  const games = await db.games.toArray();
  const gameMap = new Map(games.map((g) => [g.id, g]));

  const counts = new Map<string, { name: string; icon: string; count: number }>();

  for (const session of sessions) {
    const game = gameMap.get(session.gameId);
    if (!game) continue;
    const existing = counts.get(game.id) ?? { name: game.name, icon: game.icon, count: 0 };
    existing.count++;
    counts.set(game.id, existing);
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

/** Streaks and rivalries for all players */
export interface PlayerStreak {
  player: { id: string; name: string; emoji: string };
  currentStreak: number;     // positive = wins, negative = losses
  longestWinStreak: number;
  totalGames: number;
}

export interface Rivalry {
  player1: { id: string; name: string; emoji: string };
  player2: { id: string; name: string; emoji: string };
  gamesPlayed: number;
  player1Wins: number;
  player2Wins: number;
}

export async function computeStreaks(): Promise<PlayerStreak[]> {
  const players = await db.players.toArray();
  const sessions = await db.sessions
    .filter((s) => s.status === 'completed')
    .sortBy('completedAt');
  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));

  const streaks = new Map<string, { current: number; longestWin: number; total: number }>();
  players.forEach((p) => streaks.set(p.id, { current: 0, longestWin: 0, total: 0 }));

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;
    const winners = getWinnerIds(score, game);
    if (winners.length === 0) continue; // skip cooperative

    for (const playerId of session.playerIds) {
      const s = streaks.get(playerId);
      if (!s) continue;
      s.total++;

      if (winners.includes(playerId)) {
        s.current = s.current > 0 ? s.current + 1 : 1;
        s.longestWin = Math.max(s.longestWin, s.current);
      } else {
        s.current = s.current < 0 ? s.current - 1 : -1;
      }
    }
  }

  return players
    .map((p) => {
      const s = streaks.get(p.id)!;
      return {
        player: { id: p.id, name: p.name, emoji: p.avatarEmoji },
        currentStreak: s.current,
        longestWinStreak: s.longestWin,
        totalGames: s.total,
      };
    })
    .filter((p) => p.totalGames > 0)
    .sort((a, b) => b.currentStreak - a.currentStreak);
}

export async function computeRivalries(): Promise<Rivalry[]> {
  const players = await db.players.toArray();
  const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));
  const playerMap = new Map(players.map((p) => [p.id, p]));

  // Track pairwise game counts
  const pairs = new Map<string, { p1: string; p2: string; games: number; p1Wins: number; p2Wins: number }>();

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;
    const winners = getWinnerIds(score, game);

    const ids = [...session.playerIds].sort();
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = `${ids[i]}:${ids[j]}`;
        const pair = pairs.get(key) ?? { p1: ids[i], p2: ids[j], games: 0, p1Wins: 0, p2Wins: 0 };
        pair.games++;
        if (winners.includes(ids[i])) pair.p1Wins++;
        if (winners.includes(ids[j])) pair.p2Wins++;
        pairs.set(key, pair);
      }
    }
  }

  return Array.from(pairs.values())
    .filter((p) => p.games >= 2)
    .sort((a, b) => b.games - a.games)
    .slice(0, 5)
    .map((p) => {
      const p1 = playerMap.get(p.p1);
      const p2 = playerMap.get(p.p2);
      return {
        player1: { id: p.p1, name: p1?.name ?? '?', emoji: p1?.avatarEmoji ?? '❓' },
        player2: { id: p.p2, name: p2?.name ?? '?', emoji: p2?.avatarEmoji ?? '❓' },
        gamesPlayed: p.games,
        player1Wins: p.p1Wins,
        player2Wins: p.p2Wins,
      };
    });
}

/** Player win counts across all games */
export async function computePlayerWinCounts(): Promise<{ name: string; wins: number; losses: number }[]> {
  const players = await db.players.toArray();
  const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
  const scores = await db.scores.toArray();
  const games = await db.games.toArray();
  const scoreMap = new Map(scores.map((s) => [s.sessionId, s]));
  const gameMap = new Map(games.map((g) => [g.id, g]));

  const stats = new Map<string, { wins: number; losses: number }>();
  players.forEach((p) => stats.set(p.id, { wins: 0, losses: 0 }));

  for (const session of sessions) {
    const score = scoreMap.get(session.id);
    const game = gameMap.get(session.gameId);
    if (!score || !game) continue;
    const winners = getWinnerIds(score, game);

    for (const playerId of session.playerIds) {
      const s = stats.get(playerId);
      if (!s) continue;
      if (winners.includes(playerId)) s.wins++;
      else if (winners.length > 0) s.losses++; // Only count as loss if there was a winner (not cooperative)
    }
  }

  return players
    .map((p) => ({
      name: p.name,
      wins: stats.get(p.id)?.wins ?? 0,
      losses: stats.get(p.id)?.losses ?? 0,
    }))
    .filter((p) => p.wins + p.losses > 0)
    .sort((a, b) => b.wins - a.wins);
}
