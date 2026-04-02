'use client';

import { useState } from 'react';
import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import type { TeamDefinition } from '@/lib/models/score';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TeamsScorerProps {
  session: GameSession;
  game: Game;
  players: Player[];
  onComplete: (teams: TeamDefinition[], winningTeamIndex: number) => void;
}

export function TeamsScorer({ players, onComplete }: TeamsScorerProps) {
  // 0 = Team 1, 1 = Team 2. Auto-split evenly by default.
  const [assignments, setAssignments] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    players.forEach((p, i) => {
      initial[p.id] = i < Math.ceil(players.length / 2) ? 0 : 1;
    });
    return initial;
  });

  const [step, setStep] = useState<'teams' | 'winner' | 'confirm'>('teams');
  const [winningTeamIndex, setWinningTeamIndex] = useState<number | null>(null);

  const team1Players = players.filter((p) => assignments[p.id] === 0);
  const team2Players = players.filter((p) => assignments[p.id] === 1);
  const teamsValid = team1Players.length >= 1 && team2Players.length >= 1;

  function togglePlayer(playerId: string) {
    setAssignments((prev) => ({
      ...prev,
      [playerId]: prev[playerId] === 0 ? 1 : 0,
    }));
  }

  function buildTeams(): TeamDefinition[] {
    return [
      { name: 'Team 1', playerIds: team1Players.map((p) => p.id) },
      { name: 'Team 2', playerIds: team2Players.map((p) => p.id) },
    ];
  }

  function handleConfirm() {
    if (winningTeamIndex === null) return;
    onComplete(buildTeams(), winningTeamIndex);
  }

  return (
    <div className="space-y-6">
      {step === 'teams' && (
        <>
          <p className="text-center font-semibold">Divide into teams</p>
          <p className="text-center text-xs text-muted-foreground">
            Tap a player to switch teams
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Team 1 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-center text-blue-500">Team 1</p>
              <div className="space-y-2 min-h-[60px] rounded-lg border border-blue-500/20 bg-blue-500/5 p-2">
                {team1Players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-blue-500/10 transition-colors"
                  >
                    <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
                    <span className="text-xs font-medium truncate">{player.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-center text-red-500">Team 2</p>
              <div className="space-y-2 min-h-[60px] rounded-lg border border-red-500/20 bg-red-500/5 p-2">
                {team2Players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-red-500/10 transition-colors"
                  >
                    <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
                    <span className="text-xs font-medium truncate">{player.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep('winner')}
            disabled={!teamsValid}
            className="w-full"
          >
            Continue
          </Button>
        </>
      )}

      {step === 'winner' && (
        <>
          <p className="text-center font-semibold">Which team won?</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { index: 0, label: 'Team 1', players: team1Players, color: 'blue' },
              { index: 1, label: 'Team 2', players: team2Players, color: 'red' },
            ].map((team) => (
              <button
                key={team.index}
                onClick={() => { setWinningTeamIndex(team.index); setStep('confirm'); }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors',
                  'hover:bg-accent hover:border-primary'
                )}
              >
                <p className={cn(
                  'text-sm font-semibold',
                  team.color === 'blue' ? 'text-blue-500' : 'text-red-500'
                )}>
                  {team.label}
                </p>
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {team.players.map((p) => (
                    <PlayerAvatar key={p.id} emoji={p.avatarEmoji} color={p.avatarColor} size="sm" />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {team.players.map((p) => p.name).join(', ')}
                </div>
              </button>
            ))}
          </div>

          <Button variant="ghost" onClick={() => setStep('teams')} className="w-full">
            Back to team selection
          </Button>
        </>
      )}

      {step === 'confirm' && (
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Winner</p>
            <div className="flex flex-col items-center gap-2 mt-2">
              <p className={cn(
                'font-bold text-lg',
                winningTeamIndex === 0 ? 'text-blue-500' : 'text-red-500'
              )}>
                {winningTeamIndex === 0 ? 'Team 1' : 'Team 2'} 🏆
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {(winningTeamIndex === 0 ? team1Players : team2Players).map((p) => (
                  <div key={p.id} className="flex flex-col items-center gap-1">
                    <PlayerAvatar emoji={p.avatarEmoji} color={p.avatarColor} size="sm" />
                    <span className="text-xs">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => { setWinningTeamIndex(null); setStep('winner'); }}
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
