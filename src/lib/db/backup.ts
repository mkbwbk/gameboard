import { db } from './database';

export interface BackupData {
  version: 1;
  exportedAt: string;
  players: unknown[];
  games: unknown[];
  sessions: unknown[];
  scores: unknown[];
}

export async function exportData(): Promise<string> {
  const [players, games, sessions, scores] = await Promise.all([
    db.players.toArray(),
    db.games.toArray(),
    db.sessions.toArray(),
    db.scores.toArray(),
  ]);

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    players,
    games,
    sessions,
    scores,
  };

  return JSON.stringify(backup, null, 2);
}

// Rehydrate ISO date strings back into Date objects after JSON.parse
function rehydrateDates<T>(records: T[], dateFields: string[]): T[] {
  return records.map((record) => {
    const obj = { ...record } as Record<string, unknown>;
    for (const field of dateFields) {
      if (typeof obj[field] === 'string') {
        obj[field] = new Date(obj[field] as string);
      }
    }
    return obj as T;
  });
}

export async function importData(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString) as BackupData;

    if (!data.version || !data.players || !data.games || !data.sessions || !data.scores) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    // Rehydrate date fields that JSON.stringify converted to strings
    const players = rehydrateDates(data.players, ['createdAt']);
    const games = rehydrateDates(data.games, ['createdAt']);
    const sessions = rehydrateDates(data.sessions, ['startedAt', 'completedAt', 'createdAt']);

    // Clear existing data
    await db.transaction('rw', [db.players, db.games, db.sessions, db.scores], async () => {
      await db.players.clear();
      await db.games.clear();
      await db.sessions.clear();
      await db.scores.clear();

      // Import new data
      if (players.length) await db.players.bulkAdd(players as never[]);
      if (games.length) await db.games.bulkAdd(games as never[]);
      if (sessions.length) await db.sessions.bulkAdd(sessions as never[]);
      if (data.scores.length) await db.scores.bulkAdd(data.scores as never[]);
    });

    return {
      success: true,
      message: `Imported ${data.players.length} players, ${data.games.length} games, ${data.sessions.length} sessions.`,
    };
  } catch {
    return { success: false, message: 'Failed to parse backup file.' };
  }
}

export function downloadBackup(jsonString: string) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scoredoor-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
