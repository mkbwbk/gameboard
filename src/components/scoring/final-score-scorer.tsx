'use client';

import { useState } from 'react';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface FinalScoreScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  onComplete: (scores: Record<string, number>) => void;
}

export function FinalScoreScorer({ session, game, players, onComplete }: FinalScoreScorerProps) {
  const [scores, setScores] = useState<Record<string, string>>(
    Object.fromEntries(players.map((p) => [p.id, '']))
  );

  const allFilled = players.every((p) => scores[p.id] !== '' && !isNaN(Number(scores[p.id])));

  function handleSubmit() {
    const numericScores: Record<string, number> = {};
    players.forEach((p) => {
      numericScores[p.id] = parseInt(scores[p.id]) || 0;
    });
    onComplete(numericScores);
  }

  // Sort players by score for preview
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = parseInt(scores[a.id]) || 0;
    const scoreB = parseInt(scores[b.id]) || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-4">
      <p className="text-center font-semibold">Enter Final Scores</p>

      <Card>
        <CardContent className="p-4 space-y-3">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
              <span className="text-sm font-medium flex-1">{player.name}</span>
              <Input
                type="number"
                value={scores[player.id] ?? ''}
                onChange={(e) => setScores({ ...scores, [player.id]: e.target.value })}
                placeholder="Score"
                className="w-24 text-center"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {allFilled && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Preview Rankings</p>
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center gap-2 py-1">
                <span className="text-sm font-bold w-6">{index + 1}.</span>
                <span className="text-sm flex-1">{player.name}</span>
                <span className="text-sm font-medium">{parseInt(scores[player.id]) || 0} pts</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSubmit} disabled={!allFilled} className="w-full">
        Submit Scores
      </Button>
    </div>
  );
}
