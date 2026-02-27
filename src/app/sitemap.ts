import type { MetadataRoute } from 'next';
import { DEFAULT_GAMES, slugify } from '@/lib/constants/games';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scoredoor.app';

  const gamePages: MetadataRoute.Sitemap = DEFAULT_GAMES.map((game) => ({
    url: `${baseUrl}/game/${slugify(game.name)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...gamePages,
  ];
}
