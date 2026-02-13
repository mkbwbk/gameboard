'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { generateId } from '@/lib/utils';
import type { Game, GameConfig, ScoringType } from '@/lib/models/game';

export function useGames() {
  const games = useLiveQuery(() => db.games.orderBy('name').toArray()) ?? [];

  async function addGame(data: { name: string; scoringType: ScoringType; icon: string; config: GameConfig }) {
    const game: Game = {
      id: generateId(),
      name: data.name,
      scoringType: data.scoringType,
      icon: data.icon,
      config: data.config,
      isCustom: true,
      createdAt: new Date(),
    };
    await db.games.add(game);
    return game;
  }

  async function updateGame(id: string, data: Partial<Pick<Game, 'name' | 'icon' | 'config'>>) {
    await db.games.update(id, data);
  }

  async function deleteGame(id: string) {
    await db.games.delete(id);
  }

  return { games, addGame, updateGame, deleteGame };
}

export function useGame(id: string | undefined) {
  const game = useLiveQuery(
    () => (id ? db.games.get(id) : undefined),
    [id]
  );
  return game;
}
