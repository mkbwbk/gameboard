'use client';

import type { Player } from '@/lib/models/player';
import { PlayerAvatar } from './player-avatar';
import { formatRelativeTime } from '@/lib/utils';
import { Pencil } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  onEdit?: () => void;
}

export function PlayerCard({ player, onClick, onEdit }: PlayerCardProps) {
  return (
    <div className="flex items-center gap-3 w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left">
      <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0">
        <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{player.name}</p>
          <p className="text-xs text-muted-foreground">
            Added {formatRelativeTime(player.createdAt)}
          </p>
        </div>
      </button>
      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors shrink-0"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
