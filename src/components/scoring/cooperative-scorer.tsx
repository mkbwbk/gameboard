'use client';

import { useState } from 'react';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';

interface CooperativeScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  onComplete: (levelReached: number, won: boolean) => void;
}

export function CooperativeScorer({ players, onComplete }: CooperativeScorerProps) {
  const [level, setLevel] = useState(1);
  const [won, setWon] = useState<boolean | null>(null);

  return (
    <div className="space-y-6">
      {/* Team display */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">Team</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {players.map((player) => (
            <div key={player.id} className="flex flex-col items-center gap-1">
              <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
              <span className="text-xs">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level selector */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3 text-center">Level Reached</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLevel(Math.max(1, level - 1))}
              disabled={level <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-4xl font-bold w-16 text-center">{level}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLevel(level + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Or type directly:
          </p>
          <Input
            type="number"
            value={level}
            onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center mx-auto mt-1"
            min={1}
          />
        </CardContent>
      </Card>

      {/* Win/Fail */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3 text-center">Did the team win?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={won === true ? 'default' : 'outline'}
              onClick={() => setWon(true)}
              className="h-16 flex flex-col"
            >
              <span className="text-xl">🎉</span>
              <span className="text-xs mt-1">Won!</span>
            </Button>
            <Button
              variant={won === false ? 'default' : 'outline'}
              onClick={() => setWon(false)}
              className="h-16 flex flex-col"
            >
              <span className="text-xl">😵</span>
              <span className="text-xs mt-1">Failed</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => won !== null && onComplete(level, won)}
        disabled={won === null}
        className="w-full"
      >
        Submit Result
      </Button>
    </div>
  );
}
