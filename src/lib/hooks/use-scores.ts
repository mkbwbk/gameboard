'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import type { ScoreData } from '@/lib/models/score';

export function useScore(sessionId: string | undefined) {
  const score = useLiveQuery(
    () =>
      sessionId
        ? db.scores.where('sessionId').equals(sessionId).first()
        : undefined,
    [sessionId]
  );
  return score;
}

export async function saveScore(score: ScoreData) {
  const existing = await db.scores.where('sessionId').equals(score.sessionId).first();
  if (existing) {
    await db.scores.update(existing.id, score);
  } else {
    await db.scores.add(score);
  }
}
