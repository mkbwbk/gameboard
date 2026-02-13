'use client';

import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { GameCard } from '@/components/games/game-card';
import { Button } from '@/components/ui/button';
import { useGames } from '@/lib/hooks/use-games';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { useRouter } from 'next/navigation';
import { Plus, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

type SortMode = 'alpha' | 'most_played';

export default function GamesPage() {
  const { games } = useGames();
  const router = useRouter();
  const [sort, setSort] = useState<SortMode>('alpha');

  // Get play counts per game
  const playCounts = useLiveQuery(async () => {
    const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
    const counts = new Map<string, number>();
    for (const s of sessions) {
      counts.set(s.gameId, (counts.get(s.gameId) ?? 0) + 1);
    }
    return counts;
  }) ?? new Map<string, number>();

  const sortGames = (list: typeof games) => {
    const sorted = [...list];
    if (sort === 'most_played') {
      sorted.sort((a, b) => (playCounts.get(b.id) ?? 0) - (playCounts.get(a.id) ?? 0));
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  };

  const builtIn = sortGames(games.filter((g) => !g.isCustom));
  const custom = sortGames(games.filter((g) => g.isCustom));

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {games.length} game{games.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setSort(sort === 'alpha' ? 'most_played' : 'alpha')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md border"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sort === 'alpha' ? 'A-Z' : 'Most Played'}
          </button>
        </div>
        <Button size="sm" asChild>
          <Link href="/games/create">
            <Plus className="h-4 w-4 mr-1" />
            Custom Game
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {builtIn.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => router.push(`/games/${game.id}`)}
            badge={playCounts.get(game.id) ? `${playCounts.get(game.id)} played` : undefined}
          />
        ))}
      </div>

      {custom.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Custom Games</h3>
          <div className="space-y-2">
            {custom.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => router.push(`/games/${game.id}`)}
                badge={playCounts.get(game.id) ? `${playCounts.get(game.id)} played` : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
