'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { GameCard } from '@/components/games/game-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGames } from '@/lib/hooks/use-games';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { useRouter } from 'next/navigation';
import { Plus, ArrowUpDown, Heart, Search } from 'lucide-react';
import { GameCategory } from '@/lib/models/game';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type SortMode = 'alpha' | 'most_played';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: GameCategory.STRATEGY, label: 'Strategy' },
  { value: GameCategory.PARTY, label: 'Party' },
  { value: GameCategory.FAMILY, label: 'Family' },
  { value: GameCategory.CARD_GAMES, label: 'Card Games' },
  { value: GameCategory.CLASSIC, label: 'Classic' },
  { value: GameCategory.COOPERATIVE, label: 'Co-op' },
];

export default function GamesPage() {
  const { games, toggleFavourite } = useGames();
  const router = useRouter();
  const [sort, setSort] = useState<SortMode>('alpha');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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

  // Filter by search
  const searchFiltered = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  // Favourites (always shown at top, unaffected by category filter)
  const favourites = sortGames(searchFiltered.filter((g) => g.isFavourite));

  // Filter non-favourites by category
  const categoryFiltered = searchFiltered.filter((g) => {
    if (g.isFavourite) return false;
    if (activeCategory === 'all') return true;
    return g.category === activeCategory;
  });

  const builtIn = sortGames(categoryFiltered.filter((g) => !g.isCustom));
  const custom = sortGames(categoryFiltered.filter((g) => g.isCustom));

  return (
    <PageContainer>
      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              activeCategory === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort + count + create */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {builtIn.length + custom.length + favourites.length} game{(builtIn.length + custom.length + favourites.length) !== 1 ? 's' : ''}
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

      {/* Favourites section */}
      {favourites.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            Favourites
          </h3>
          <div className="space-y-2">
            {favourites.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => router.push(`/games/${game.id}`)}
                badge={playCounts.get(game.id) ? `${playCounts.get(game.id)} played` : undefined}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Built-in games */}
      <div className="space-y-2">
        {builtIn.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => router.push(`/games/${game.id}`)}
            badge={playCounts.get(game.id) ? `${playCounts.get(game.id)} played` : undefined}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </div>

      {/* Custom games */}
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
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {builtIn.length === 0 && custom.length === 0 && favourites.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No games found{search ? ` for "${search}"` : ''}.
        </p>
      )}
    </PageContainer>
  );
}
