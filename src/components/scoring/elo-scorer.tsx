'use client';

import { useState } from 'react';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePlayerRating } from '@/lib/hooks/use-elo';
import { calculateNewRatings } from '@/lib/scoring/elo';
import { cn } from '@/lib/utils';

interface EloScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  onComplete: (result: 'player1_win' | 'player2_win' | 'draw') => void;
}

export function EloScorer({ game, players, onComplete }: EloScorerProps) {
  const [result, setResult] = useState<'player1_win' | 'player2_win' | 'draw' | null>(null);

  const player1 = players[0];
  const player2 = players[1];

  const rating1 = usePlayerRating(player1?.id, game.id);
  const rating2 = usePlayerRating(player2?.id, game.id);

  if (!player1 || !player2) return null;

  // Preview new ratings
  const scoreA = result === 'player1_win' ? 1 : result === 'draw' ? 0.5 : 0;
  const preview = result ? calculateNewRatings(rating1, rating2, scoreA) : null;

  return (
    <div className="space-y-6">
      {/* Current ratings */}
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <PlayerAvatar emoji={player1.avatarEmoji} color={player1.avatarColor} size="lg" />
          <span className="font-medium text-sm">{player1.name}</span>
          <span className="text-lg font-bold">{rating1}</span>
          {preview && (
            <span className={cn(
              'text-sm font-medium',
              preview.newRatingA > rating1 ? 'text-green-600' : preview.newRatingA < rating1 ? 'text-red-600' : 'text-muted-foreground'
            )}>
              → {preview.newRatingA} ({preview.newRatingA > rating1 ? '+' : ''}{preview.newRatingA - rating1})
            </span>
          )}
        </div>
        <span className="text-2xl font-bold text-muted-foreground">vs</span>
        <div className="flex flex-col items-center gap-2">
          <PlayerAvatar emoji={player2.avatarEmoji} color={player2.avatarColor} size="lg" />
          <span className="font-medium text-sm">{player2.name}</span>
          <span className="text-lg font-bold">{rating2}</span>
          {preview && (
            <span className={cn(
              'text-sm font-medium',
              preview.newRatingB > rating2 ? 'text-green-600' : preview.newRatingB < rating2 ? 'text-red-600' : 'text-muted-foreground'
            )}>
              → {preview.newRatingB} ({preview.newRatingB > rating2 ? '+' : ''}{preview.newRatingB - rating2})
            </span>
          )}
        </div>
      </div>

      {/* Result selection */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3 text-center">Result</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={result === 'player1_win' ? 'default' : 'outline'}
              onClick={() => setResult('player1_win')}
              className="flex flex-col h-auto py-3"
            >
              <span className="text-lg">{player1.avatarEmoji}</span>
              <span className="text-xs mt-1">Win</span>
            </Button>
            {game.config.allowDraw && (
              <Button
                variant={result === 'draw' ? 'default' : 'outline'}
                onClick={() => setResult('draw')}
                className="flex flex-col h-auto py-3"
              >
                <span className="text-lg">🤝</span>
                <span className="text-xs mt-1">Draw</span>
              </Button>
            )}
            <Button
              variant={result === 'player2_win' ? 'default' : 'outline'}
              onClick={() => setResult('player2_win')}
              className="flex flex-col h-auto py-3"
            >
              <span className="text-lg">{player2.avatarEmoji}</span>
              <span className="text-xs mt-1">Win</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => result && onComplete(result)}
        disabled={!result}
        className="w-full"
      >
        Submit Result
      </Button>
    </div>
  );
}
