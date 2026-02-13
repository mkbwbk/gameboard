'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/shared/empty-state';
import { PlayerCard } from '@/components/players/player-card';
import { PlayerForm } from '@/components/players/player-form';
import { Button } from '@/components/ui/button';
import { usePlayers } from '@/lib/hooks/use-players';
import { Plus } from 'lucide-react';

export default function PlayersPage() {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<typeof players[0] | null>(null);
  const router = useRouter();

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {players.length} player{players.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Player
        </Button>
      </div>

      {players.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No players yet"
          description="Add your friends to start tracking scores!"
        >
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Player
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => router.push(`/players/${player.id}`)}
              onEdit={() => setEditingPlayer(player)}
            />
          ))}
        </div>
      )}

      <PlayerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={addPlayer}
      />

      {editingPlayer && (
        <PlayerForm
          open={!!editingPlayer}
          onOpenChange={(open) => { if (!open) setEditingPlayer(null); }}
          onSubmit={(data) => {
            updatePlayer(editingPlayer.id, data);
            setEditingPlayer(null);
          }}
          onDelete={() => {
            deletePlayer(editingPlayer.id);
            setEditingPlayer(null);
          }}
          initialData={{
            name: editingPlayer.name,
            avatarEmoji: editingPlayer.avatarEmoji,
            avatarColor: editingPlayer.avatarColor,
          }}
          title="Edit Player"
        />
      )}
    </PageContainer>
  );
}
