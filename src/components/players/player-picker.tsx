'use client';

import type { Player } from '@/lib/models/player';
import { PlayerAvatar } from './player-avatar';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PlayerPickerProps {
  players: Player[];
  selected: string[];
  onToggle: (playerId: string) => void;
  min?: number;
  max?: number;
}

export function PlayerPicker({ players, selected, onToggle, min, max }: PlayerPickerProps) {
  const atMax = max !== undefined && selected.length >= max;

  return (
    <div className="space-y-2">
      {min !== undefined && max !== undefined && (
        <p className="text-xs text-muted-foreground">
          Select {min === max ? min : `${min}-${max}`} players ({selected.length} selected)
        </p>
      )}
      <div className="space-y-1">
        {players.map((player) => {
          const isSelected = selected.includes(player.id);
          const isDisabled = !isSelected && atMax;

          return (
            <button
              key={player.id}
              type="button"
              onClick={() => !isDisabled && onToggle(player.id)}
              disabled={isDisabled}
              className={cn(
                'flex items-center gap-3 w-full p-3 rounded-lg border transition-colors text-left',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-accent'
              )}
            >
              <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
              <span className="flex-1 font-medium text-sm">{player.name}</span>
              {isSelected && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
