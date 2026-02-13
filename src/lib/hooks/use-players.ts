'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { generateId } from '@/lib/utils';
import type { Player } from '@/lib/models/player';

export function usePlayers() {
  const players = useLiveQuery(() => db.players.orderBy('name').toArray()) ?? [];

  async function addPlayer(data: Pick<Player, 'name' | 'avatarEmoji' | 'avatarColor'>) {
    const player: Player = {
      id: generateId(),
      name: data.name,
      avatarEmoji: data.avatarEmoji,
      avatarColor: data.avatarColor,
      createdAt: new Date(),
    };
    await db.players.add(player);
    return player;
  }

  async function updatePlayer(id: string, data: Partial<Pick<Player, 'name' | 'avatarEmoji' | 'avatarColor'>>) {
    await db.players.update(id, data);
  }

  async function deletePlayer(id: string) {
    await db.players.delete(id);
  }

  return { players, addPlayer, updatePlayer, deletePlayer };
}

export function usePlayer(id: string | undefined) {
  const player = useLiveQuery(
    () => (id ? db.players.get(id) : undefined),
    [id]
  );
  return player;
}
