'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { generateId } from '@/lib/utils';
import { SessionStatus, type GameSession } from '@/lib/models/session';

export function useSessions() {
  const sessions = useLiveQuery(
    () => db.sessions.orderBy('startedAt').reverse().toArray()
  ) ?? [];

  return { sessions };
}

export function useSession(id: string | undefined) {
  const session = useLiveQuery(
    () => (id ? db.sessions.get(id) : undefined),
    [id]
  );
  return session;
}

export async function createSession(gameId: string, playerIds: string[]): Promise<string> {
  const session: GameSession = {
    id: generateId(),
    gameId,
    playerIds,
    status: SessionStatus.IN_PROGRESS,
    startedAt: new Date(),
  };
  await db.sessions.add(session);
  return session.id;
}

export async function completeSession(id: string) {
  await db.sessions.update(id, {
    status: SessionStatus.COMPLETED,
    completedAt: new Date(),
  });
}

export async function abandonSession(id: string) {
  await db.sessions.update(id, {
    status: SessionStatus.ABANDONED,
    completedAt: new Date(),
  });
}

export async function updateSessionNotes(id: string, notes: string) {
  await db.sessions.update(id, { notes });
}
