'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEFAULT_GAMES, slugify } from '@/lib/constants/games';
import { GameCategory } from '@/lib/models/game';

const categoryLabels: Record<GameCategory, string> = {
  [GameCategory.CLASSIC]: 'Classic',
  [GameCategory.STRATEGY]: 'Strategy',
  [GameCategory.PARTY]: 'Party',
  [GameCategory.FAMILY]: 'Family',
  [GameCategory.CARD_GAMES]: 'Card Games',
  [GameCategory.COOPERATIVE]: 'Co-op',
};

const categoryOrder: GameCategory[] = [
  GameCategory.STRATEGY,
  GameCategory.PARTY,
  GameCategory.FAMILY,
  GameCategory.CARD_GAMES,
  GameCategory.CLASSIC,
  GameCategory.COOPERATIVE,
];

export function GameLibrarySection() {
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'all'>('all');

  const filteredGames = activeCategory === 'all'
    ? DEFAULT_GAMES
    : DEFAULT_GAMES.filter(g => g.category === activeCategory);

  return (
    <section id="games" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Your Favorite Games, Ready to Score
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            45+ popular board games pre-loaded with the perfect scoring setup. Plus add your own.
          </p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            All Games
          </button>
          {categoryOrder.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-500 text-center mb-8">
          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
        </p>

        {/* Games grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredGames.map((game) => (
            <Link
              key={game.name}
              href={`/game/${slugify(game.name)}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/[0.12] active:scale-[0.97] active:bg-white/[0.1] transition-all duration-150"
            >
              <span className="text-lg flex-shrink-0">{game.icon}</span>
              <span className="text-sm text-slate-300 truncate">
                {game.name}
              </span>
            </Link>
          ))}
          {/* Custom game card */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/15 active:scale-[0.97] transition-all duration-150"
          >
            <span className="text-lg flex-shrink-0">➕</span>
            <span className="text-sm text-indigo-400 font-medium">
              Your Games
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
