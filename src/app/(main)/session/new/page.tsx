'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { GameCard } from '@/components/games/game-card';
import { PlayerPicker } from '@/components/players/player-picker';
import { Button } from '@/components/ui/button';
import { useGames } from '@/lib/hooks/use-games';
import { usePlayers } from '@/lib/hooks/use-players';
import { createSession } from '@/lib/hooks/use-session';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function NewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGameId = searchParams.get('gameId');
  const preselectedPlayers = searchParams.get('players')?.split(',').filter(Boolean) ?? [];

  const { games } = useGames();
  const { players } = usePlayers();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(preselectedGameId);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(preselectedPlayers);

  const selectedGame = games.find((g) => g.id === selectedGameId);

  function togglePlayer(playerId: string) {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  }

  async function handleStart() {
    if (!selectedGameId || selectedPlayerIds.length === 0) return;
    const sessionId = await createSession(selectedGameId, selectedPlayerIds);
    router.push(`/session/${sessionId}`);
  }

  const canStart =
    selectedGame &&
    selectedPlayerIds.length >= selectedGame.config.minPlayers &&
    selectedPlayerIds.length <= selectedGame.config.maxPlayers;

  // Step 1: Pick a game
  if (!selectedGameId) {
    return (
      <PageContainer>
        <h2 className="text-lg font-bold mb-4">Choose a Game</h2>
        {games.length === 0 ? (
          <p className="text-muted-foreground">No games available.</p>
        ) : (
          <div className="space-y-2">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => {
                  setSelectedGameId(game.id);
                  setSelectedPlayerIds([]);
                }}
              />
            ))}
          </div>
        )}
      </PageContainer>
    );
  }

  // Step 2: Pick players
  return (
    <PageContainer>
      <button
        onClick={() => { setSelectedGameId(null); setSelectedPlayerIds([]); }}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Change game
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{selectedGame?.icon}</span>
        <h2 className="text-lg font-bold">{selectedGame?.name}</h2>
      </div>

      <h3 className="font-semibold mb-3">Select Players</h3>

      {players.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-3">No players yet!</p>
          <Button asChild variant="outline">
            <Link href="/players">Add Players First</Link>
          </Button>
        </div>
      ) : (
        <>
          <PlayerPicker
            players={players}
            selected={selectedPlayerIds}
            onToggle={togglePlayer}
            min={selectedGame?.config.minPlayers}
            max={selectedGame?.config.maxPlayers}
          />
          <Button
            className="w-full mt-6"
            disabled={!canStart}
            onClick={handleStart}
          >
            Start Game
          </Button>
        </>
      )}
    </PageContainer>
  );
}

export default function NewSessionPage() {
  return (
    <Suspense fallback={<PageContainer><p>Loading...</p></PageContainer>}>
      <NewSessionContent />
    </Suspense>
  );
}
