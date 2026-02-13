'use client';

import { use } from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { useGame } from '@/lib/hooks/use-games';
import { useScore } from '@/lib/hooks/use-scores';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { PageContainer } from '@/components/layout/page-container';
import { ScoringEngine } from '@/components/scoring/scoring-engine';
import { Badge } from '@/components/ui/badge';
import type { Player } from '@/lib/models/player';

export default function ActiveSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const session = useSession(sessionId);
  const game = useGame(session?.gameId);
  const score = useScore(sessionId);

  const players = useLiveQuery(async () => {
    if (!session) return [];
    const all = await db.players.bulkGet(session.playerIds);
    return all.filter(Boolean) as Player[];
  }, [session?.playerIds]) ?? [];

  if (!session || !game) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading session...</p>
      </PageContainer>
    );
  }

  if (session.status === 'completed') {
    return (
      <PageContainer>
        <p className="text-muted-foreground">This game has been completed.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{game.icon}</span>
        <div>
          <h2 className="text-lg font-bold">{game.name}</h2>
          <Badge variant="outline">In Progress</Badge>
        </div>
      </div>

      <ScoringEngine
        session={session}
        game={game}
        players={players}
        existingScore={score}
      />
    </PageContainer>
  );
}
