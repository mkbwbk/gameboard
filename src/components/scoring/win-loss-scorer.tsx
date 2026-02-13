'use client';

import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface WinLossScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  onComplete: (winnerId: string, loserId?: string) => void;
}

export function WinLossScorer({ session, game, players, onComplete }: WinLossScorerProps) {
  const trackLastPlace = game.config.trackLastPlace;
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [loserId, setLoserId] = useState<string | null>(null);

  const step = winnerId === null ? 'winner' : trackLastPlace && loserId === null ? 'loser' : 'confirm';

  function handleConfirm() {
    if (!winnerId) return;
    onComplete(winnerId, loserId ?? undefined);
  }

  return (
    <div className="space-y-6">
      {step === 'winner' && (
        <>
          <p className="text-center font-semibold">Who won?</p>
          <div className="grid grid-cols-2 gap-3">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => setWinnerId(player.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors',
                  'hover:bg-accent hover:border-primary'
                )}
              >
                <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="lg" />
                <span className="font-medium text-sm">{player.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'loser' && (
        <>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Winner: {players.find((p) => p.id === winnerId)?.name}</p>
            <p className="font-semibold mt-2">Who came last? 💩</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {players
              .filter((p) => p.id !== winnerId)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => setLoserId(player.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors',
                    'hover:bg-accent hover:border-destructive'
                  )}
                >
                  <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="lg" />
                  <span className="font-medium text-sm">{player.name}</span>
                </button>
              ))}
          </div>
          <Button variant="ghost" onClick={() => setLoserId('skip')} className="w-full">
            Skip — no specific last place
          </Button>
        </>
      )}

      {step === 'confirm' && (
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Winner</p>
            <div className="flex flex-col items-center gap-2 mt-2">
              {(() => {
                const winner = players.find((p) => p.id === winnerId)!;
                return (
                  <>
                    <PlayerAvatar emoji={winner.avatarEmoji} color={winner.avatarColor} size="lg" />
                    <span className="font-bold text-lg">{winner.name} 🏆</span>
                  </>
                );
              })()}
            </div>
          </div>

          {trackLastPlace && loserId && loserId !== 'skip' && (
            <div>
              <p className="text-sm text-muted-foreground">Last Place</p>
              <div className="flex flex-col items-center gap-2 mt-2">
                {(() => {
                  const loser = players.find((p) => p.id === loserId)!;
                  return (
                    <>
                      <PlayerAvatar emoji={loser.avatarEmoji} color={loser.avatarColor} size="lg" />
                      <span className="font-medium">{loser.name} 💩</span>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => { setWinnerId(null); setLoserId(null); }}
              className="flex-1"
            >
              Change
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
