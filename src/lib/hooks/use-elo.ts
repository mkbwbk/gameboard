'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { DEFAULT_RATING } from '@/lib/scoring/elo';
import type { EloScore } from '@/lib/models/score';

export function usePlayerRating(playerId: string | undefined, gameId: string | undefined) {
  const rating = useLiveQuery(async () => {
    if (!playerId || !gameId) return DEFAULT_RATING;

    // Get all completed sessions for this game involving this player
    const sessions = await db.sessions
      .where('gameId')
      .equals(gameId)
      .filter((s) => s.status === 'completed' && s.playerIds.includes(playerId))
      .sortBy('completedAt');

    if (sessions.length === 0) return DEFAULT_RATING;

    // Get the most recent score for this player
    const lastSession = sessions[sessions.length - 1];
    const score = await db.scores
      .where('sessionId')
      .equals(lastSession.id)
      .first() as EloScore | undefined;

    if (!score?.playerResults?.[playerId]) return DEFAULT_RATING;

    return score.playerResults[playerId].ratingAfter;
  }, [playerId, gameId]);

  return rating ?? DEFAULT_RATING;
}
