'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/shared/empty-state';
import { SessionCard } from '@/components/history/session-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { Player } from '@/lib/models/player';
import type { ScoreData } from '@/lib/models/score';

export default function HistoryPage() {
  const router = useRouter();
  const [filterGame, setFilterGame] = useState<string>('all');
  const [filterPlayer, setFilterPlayer] = useState<string>('all');

  const games = useLiveQuery(() => db.games.orderBy('name').toArray()) ?? [];
  const allPlayers = useLiveQuery(() => db.players.toArray()) ?? [];

  const data = useLiveQuery(async () => {
    const sessions = await db.sessions.orderBy('startedAt').reverse().toArray();
    const players = await db.players.toArray();
    const allGames = await db.games.toArray();
    const allScores = await db.scores.toArray();

    const playerMap = new Map(players.map((p) => [p.id, p]));
    const gameMap = new Map(allGames.map((g) => [g.id, g]));
    const scoreMap = new Map(allScores.map((s) => [s.sessionId, s]));

    return sessions.map((session) => ({
      session,
      game: gameMap.get(session.gameId)!,
      players: session.playerIds.map((id) => playerMap.get(id)).filter(Boolean) as Player[],
      score: scoreMap.get(session.id) as ScoreData | undefined,
    })).filter((item) => item.game);
  });

  if (!data) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  if (data.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon="📜"
          title="No games played yet"
          description="Your game history will appear here after you play some games."
        >
          <Button asChild>
            <Link href="/session/new">Play a Game</Link>
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  // Apply filters
  const filtered = data.filter((item) => {
    if (filterGame !== 'all' && item.session.gameId !== filterGame) return false;
    if (filterPlayer !== 'all' && !item.session.playerIds.includes(filterPlayer)) return false;
    return true;
  });

  const hasFilters = filterGame !== 'all' || filterPlayer !== 'all';

  const inProgress = filtered.filter((d) => d.session.status === 'in_progress');
  const completed = filtered.filter((d) => d.session.status === 'completed');

  return (
    <PageContainer>
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Select value={filterGame} onValueChange={setFilterGame}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="All games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            {games.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.icon} {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPlayer} onValueChange={setFilterPlayer}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="All players" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Players</SelectItem>
            {allPlayers.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.avatarEmoji} {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setFilterGame('all'); setFilterPlayer('all'); }}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {filtered.length === 0 && hasFilters && (
        <EmptyState
          icon="🔍"
          title="No matches"
          description="No games found with these filters."
        >
          <Button variant="outline" onClick={() => { setFilterGame('all'); setFilterPlayer('all'); }}>
            Clear Filters
          </Button>
        </EmptyState>
      )}

      {inProgress.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">In Progress</h3>
          <div className="space-y-2">
            {inProgress.map((item) => (
              <SessionCard
                key={item.session.id}
                session={item.session}
                game={item.game}
                players={item.players}
                score={item.score}
                onClick={() => router.push(`/session/${item.session.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Completed ({completed.length})
          </h3>
          <div className="space-y-2">
            {completed.map((item) => (
              <SessionCard
                key={item.session.id}
                session={item.session}
                game={item.game}
                players={item.players}
                score={item.score}
                onClick={() => router.push(`/session/${item.session.id}/complete`)}
              />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
