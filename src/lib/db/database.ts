import Dexie, { type EntityTable } from 'dexie';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import type { ScoreData } from '@/lib/models/score';

class GameBoardDB extends Dexie {
  players!: EntityTable<Player, 'id'>;
  games!: EntityTable<Game, 'id'>;
  sessions!: EntityTable<GameSession, 'id'>;
  scores!: EntityTable<ScoreData, 'id'>;

  constructor() {
    super('GameBoardDB');
    this.version(1).stores({
      players: 'id, name, createdAt',
      games: 'id, name, scoringType, isCustom',
      sessions: 'id, gameId, status, startedAt, completedAt, *playerIds',
      scores: 'id, sessionId, type',
    });
  }
}

export const db = new GameBoardDB();
