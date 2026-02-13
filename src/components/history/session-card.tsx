'use client';

import type { GameSession } from '@/lib/models/session';
import type { Game } from '@/lib/models/game';
import type { Player } from '@/lib/models/player';
import type { ScoreData, WinLossScore, FinalScoreResult, RaceScore, EloScore, RoundBasedScore, CooperativeScore } from '@/lib/models/score';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface SessionCardProps {
  session: GameSession;
  game: Game;
  players: Player[];
  score?: ScoreData;
  onClick?: () => void;
}

function getResultSummary(score: ScoreData, players: Player[], game: Game): string {
  switch (score.type) {
    case 'win_loss': {
      const s = score as WinLossScore;
      const winner = players.find((p) => p.id === s.winnerId);
      return `${winner?.name ?? 'Unknown'} won`;
    }
    case 'final_score': {
      const s = score as FinalScoreResult;
      const sorted = Object.entries(s.scores).sort(([, a], [, b]) => b - a);
      const winnerId = sorted[0]?.[0];
      const winner = players.find((p) => p.id === winnerId);
      return `${winner?.name ?? 'Unknown'} won with ${sorted[0]?.[1]} pts`;
    }
    case 'race': {
      const s = score as RaceScore;
      const winner = players.find((p) => p.id === s.winnerId);
      const scoreStr = players.map((p) => s.scores[p.id] ?? 0).join('-');
      return `${winner?.name ?? 'Unknown'} won ${scoreStr}`;
    }
    case 'round_based': {
      const s = score as RoundBasedScore;
      const sorted = Object.entries(s.finalTotals).sort(([, a], [, b]) =>
        game.config.lowestWins ? a - b : b - a
      );
      const winnerId = sorted[0]?.[0];
      const winner = players.find((p) => p.id === winnerId);
      return `${winner?.name ?? 'Unknown'} won (${s.rounds.length} rounds)`;
    }
    case 'elo': {
      const s = score as EloScore;
      const winnerId = Object.entries(s.playerResults).find(([, r]) => r.outcome === 'win')?.[0];
      if (!winnerId) return 'Draw';
      const winner = players.find((p) => p.id === winnerId);
      return `${winner?.name ?? 'Unknown'} won`;
    }
    case 'cooperative': {
      const s = score as CooperativeScore;
      return `Level ${s.levelReached} ${s.won ? '(Won!)' : '(Failed)'}`;
    }
    default:
      return '';
  }
}

export function SessionCard({ session, game, players, score, onClick }: SessionCardProps) {
  const isInProgress = session.status === 'in_progress';

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
    >
      <span className="text-2xl shrink-0">{game.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{game.name}</p>
          {isInProgress && <Badge variant="outline" className="text-xs shrink-0">Live</Badge>}
        </div>
        {score && !isInProgress && (
          <p className="text-xs text-muted-foreground truncate">{getResultSummary(score, players, game)}</p>
        )}
        {session.notes && (
          <p className="text-xs text-muted-foreground/70 truncate italic">"{session.notes}"</p>
        )}
        <div className="flex items-center gap-1 mt-1">
          {players.slice(0, 4).map((p) => (
            <PlayerAvatar key={p.id} emoji={p.avatarEmoji} color={p.avatarColor} size="sm" className="h-5 w-5 text-xs" />
          ))}
          {players.length > 4 && <span className="text-xs text-muted-foreground">+{players.length - 4}</span>}
        </div>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">
        {formatRelativeTime(session.completedAt ?? session.startedAt)}
      </span>
    </button>
  );
}
