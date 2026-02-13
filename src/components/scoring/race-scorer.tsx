'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import type { RaceScore, RaceRound } from '@/lib/models/score';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { saveScore } from '@/lib/hooks/use-scores';
import { generateId } from '@/lib/utils';
import { Undo2 } from 'lucide-react';

interface RaceScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  existingScore?: RaceScore;
  onComplete: (winnerId: string) => void;
}

export function RaceScorer({ session, game, players, existingScore, onComplete }: RaceScorerProps) {
  const targetScore = game.config.targetScore ?? 7;

  const [rounds, setRounds] = useState<RaceRound[]>(existingScore?.rounds ?? []);
  const [scores, setScores] = useState<Record<string, number>>(
    existingScore?.scores ?? Object.fromEntries(players.map((p) => [p.id, 0]))
  );

  const persist = useCallback(async (newRounds: RaceRound[], newScores: Record<string, number>) => {
    const scoreData: RaceScore = {
      id: existingScore?.id ?? generateId(),
      type: 'race',
      sessionId: session.id,
      rounds: newRounds,
      scores: newScores,
      winnerId: null,
      targetScore,
    };
    await saveScore(scoreData);
  }, [existingScore?.id, session.id, targetScore]);

  useEffect(() => {
    if (rounds.length > 0) {
      persist(rounds, scores);
    }
  }, [rounds, scores, persist]);

  function addRound(winnerId: string, points: number = 1) {
    const newRounds = [...rounds, {
      roundNumber: rounds.length + 1,
      winnerId,
      points,
    }];
    const newScores = { ...scores, [winnerId]: (scores[winnerId] ?? 0) + points };
    setRounds(newRounds);
    setScores(newScores);

    if (newScores[winnerId] >= targetScore) {
      onComplete(winnerId);
    }
  }

  function undoLastRound() {
    if (rounds.length === 0) return;
    const lastRound = rounds[rounds.length - 1];
    const newScores = {
      ...scores,
      [lastRound.winnerId]: scores[lastRound.winnerId] - lastRound.points,
    };
    setRounds(rounds.slice(0, -1));
    setScores(newScores);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">First to {targetScore}</p>
        <p className="text-xs text-muted-foreground">Round {rounds.length + 1}</p>
      </div>

      {/* Score display */}
      <div className="flex items-center justify-center gap-8">
        {players.map((player) => (
          <div key={player.id} className="flex flex-col items-center gap-2">
            <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="lg" />
            <span className="font-medium text-sm">{player.name}</span>
            <span className="text-3xl font-bold">{scores[player.id] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Point buttons per player */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3 text-center">Who won this round?</p>
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <span className="text-sm font-medium flex-1">{player.name}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addRound(player.id, 1)}
                >
                  +1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addRound(player.id, 2)}
                >
                  +2
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addRound(player.id, 3)}
                >
                  +3
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {rounds.length > 0 && (
        <Button variant="ghost" size="sm" onClick={undoLastRound} className="w-full">
          <Undo2 className="h-4 w-4 mr-1" />
          Undo Last Round
        </Button>
      )}
    </div>
  );
}
