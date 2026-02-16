'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import type { RoundBasedScore, ScoringRound } from '@/lib/models/score';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { saveScore } from '@/lib/hooks/use-scores';
import { generateId } from '@/lib/utils';
import { Plus, Undo2 } from 'lucide-react';

interface RoundScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  existingScore?: RoundBasedScore;
  onComplete: (winnerId: string) => void;
}

export function RoundScorer({ session, game, players, existingScore, onComplete }: RoundScorerProps) {
  const targetScore = game.config.targetScore;
  const lowestWins = game.config.lowestWins ?? false;
  const [rounds, setRounds] = useState<ScoringRound[]>(existingScore?.rounds ?? []);
  const [currentScores, setCurrentScores] = useState<Record<string, string>>(
    Object.fromEntries(players.map((p) => [p.id, '']))
  );
  const [showInput, setShowInput] = useState(false);

  const totals: Record<string, number> = {};
  players.forEach((p) => {
    totals[p.id] = rounds.reduce((sum, r) => sum + (r.scores[p.id] ?? 0), 0);
  });

  const persist = useCallback(async (newRounds: ScoringRound[]) => {
    const newTotals: Record<string, number> = {};
    players.forEach((p) => {
      newTotals[p.id] = newRounds.reduce((sum, r) => sum + (r.scores[p.id] ?? 0), 0);
    });

    const scoreData: RoundBasedScore = {
      id: existingScore?.id ?? generateId(),
      type: 'round_based',
      sessionId: session.id,
      rounds: newRounds,
      finalTotals: newTotals,
    };
    await saveScore(scoreData);
  }, [existingScore?.id, session.id, players]);

  useEffect(() => {
    if (rounds.length > 0) {
      persist(rounds);
    }
  }, [rounds, persist]);

  function addRound() {
    const roundScores: Record<string, number> = {};
    players.forEach((p) => {
      roundScores[p.id] = parseInt(currentScores[p.id]) || 0;
    });

    const newRound: ScoringRound = {
      roundNumber: rounds.length + 1,
      scores: roundScores,
    };

    const newRounds = [...rounds, newRound];
    setRounds(newRounds);
    setCurrentScores(Object.fromEntries(players.map((p) => [p.id, ''])));
    setShowInput(false);

    // Auto-complete if a player hit the target score
    if (targetScore) {
      const newTotals: Record<string, number> = {};
      players.forEach((p) => {
        newTotals[p.id] = newRounds.reduce((sum, r) => sum + (r.scores[p.id] ?? 0), 0);
      });

      // For highest-wins: first player to reach or exceed the target wins
      if (!lowestWins) {
        const winner = players.find((p) => newTotals[p.id] >= targetScore);
        if (winner) {
          onComplete(winner.id);
          return;
        }
      }
    }
  }

  function undoLastRound() {
    if (rounds.length === 0) return;
    setRounds(rounds.slice(0, -1));
  }

  function handleFinish() {
    const entries = Object.entries(totals);
    entries.sort((a, b) => lowestWins ? a[1] - b[1] : b[1] - a[1]);
    onComplete(entries[0][0]);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        {targetScore && (
          <p className="text-sm text-muted-foreground">
            {lowestWins ? 'Lowest score wins' : `First to ${targetScore}`}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {rounds.length} round{rounds.length !== 1 ? 's' : ''} played
        </p>
      </div>

      {/* Running totals */}
      <div className="flex items-center justify-around">
        {players.map((player) => (
          <div key={player.id} className="flex flex-col items-center gap-1">
            <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
            <span className="text-xs font-medium truncate max-w-[60px]">{player.name}</span>
            <span className="text-xl font-bold">{totals[player.id]}</span>
          </div>
        ))}
      </div>

      {/* Round history */}
      {rounds.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 pr-2 text-xs text-muted-foreground">Rd</th>
                    {players.map((p) => (
                      <th key={p.id} className="text-center py-1 px-1 text-xs text-muted-foreground truncate max-w-[60px]">
                        {p.name.slice(0, 6)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((round) => (
                    <tr key={round.roundNumber} className="border-b last:border-0">
                      <td className="py-1 pr-2 text-muted-foreground">{round.roundNumber}</td>
                      {players.map((p) => (
                        <td key={p.id} className="text-center py-1 px-1">
                          {round.scores[p.id] ?? 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add round input */}
      {showInput ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-medium">Round {rounds.length + 1} Scores</p>
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <span className="text-sm flex-1">{player.name}</span>
                <Input
                  type="number"
                  value={currentScores[player.id] ?? ''}
                  onChange={(e) =>
                    setCurrentScores({ ...currentScores, [player.id]: e.target.value })
                  }
                  placeholder="0"
                  className="w-20 text-center"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowInput(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addRound} className="flex-1">
                Add Round
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowInput(true)} className="w-full">
          <Plus className="h-4 w-4 mr-1" />
          Add Round
        </Button>
      )}

      {rounds.length > 0 && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={undoLastRound} className="flex-1">
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button variant="outline" onClick={handleFinish} className="flex-1">
            Finish Game
          </Button>
        </div>
      )}
    </div>
  );
}
