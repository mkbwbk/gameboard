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

export async function importData(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString) as BackupData;

    if (!data.version || !data.players || !data.games || !data.sessions || !data.scores) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    // Clear existing data
    await db.transaction('rw', [db.players, db.games, db.sessions, db.scores], async () => {
      await db.players.clear();
      await db.games.clear();
      await db.sessions.clear();
      await db.scores.clear();

      // Import new data
      if (data.players.length) await db.players.bulkAdd(data.players as never[]);
      if (data.games.length) await db.games.bulkAdd(data.games as never[]);
      if (data.sessions.length) await db.sessions.bulkAdd(data.sessions as never[]);
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
