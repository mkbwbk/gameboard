import { db } from './database';
import { DEFAULT_GAMES } from '@/lib/constants/games';
import { generateId } from '@/lib/utils';

export async function seedDefaultGames() {
  const existingGames = await db.games.filter((g) => !g.isCustom).toArray();
  const existingNames = new Set(existingGames.map((g) => g.name));

  // Find games that haven't been seeded yet
  const newGames = DEFAULT_GAMES.filter((g) => !existingNames.has(g.name));

  if (newGames.length > 0) {
    const games = newGames.map((g) => ({
      ...g,
      id: generateId(),
      isCustom: false,
      createdAt: new Date(),
    }));
    await db.games.bulkAdd(games);
  }

  // Update existing default games if their config or metadata has changed
  for (const existing of existingGames) {
    const def = DEFAULT_GAMES.find((g) => g.name === existing.name);
    if (!def) continue;

    const configChanged = JSON.stringify(existing.config) !== JSON.stringify(def.config);
    const scoringChanged = existing.scoringType !== def.scoringType;
    const categoryChanged = existing.category !== def.category;
    const youtubeChanged = existing.youtubeVideoId !== def.youtubeVideoId;
    const amazonChanged = existing.amazonUrl !== def.amazonUrl;
    const iconChanged = existing.icon !== def.icon;

    if (configChanged || scoringChanged || categoryChanged || youtubeChanged || amazonChanged || iconChanged) {
      await db.games.update(existing.id, {
        config: def.config,
        scoringType: def.scoringType,
        icon: def.icon,
        category: def.category,
        youtubeVideoId: def.youtubeVideoId,
        amazonUrl: def.amazonUrl,
      });
    }
  }
}
