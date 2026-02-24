'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlayerAvatar } from './player-avatar';
import { AVATAR_EMOJIS, AVATAR_COLORS } from '@/lib/constants/avatars';
import { cn } from '@/lib/utils';

interface PlayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; avatarEmoji: string; avatarColor: string }) => void;
  onDelete?: () => void;
  initialData?: { name: string; avatarEmoji: string; avatarColor: string };
  title?: string;
}

export function PlayerForm({ open, onOpenChange, onSubmit, onDelete, initialData, title = 'Add Player' }: PlayerFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [emoji, setEmoji] = useState(initialData?.avatarEmoji ?? AVATAR_EMOJIS[0]);
  const [color, setColor] = useState(initialData?.avatarColor ?? AVATAR_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => {
        setName(initialData?.name ?? '');
        setEmoji(initialData?.avatarEmoji ?? AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)]);
        setColor(initialData?.avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
        setConfirmDelete(false);
      });
    }
  }, [open, initialData?.name, initialData?.avatarEmoji, initialData?.avatarColor]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), avatarEmoji: emoji, avatarColor: color });
    if (!initialData) {
      setName('');
      setEmoji(AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)]);
      setColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <PlayerAvatar emoji={emoji} color={color} size="lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player name"
              maxLength={20}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="grid grid-cols-8 gap-1">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    'h-9 w-9 flex items-center justify-center rounded-md text-lg hover:bg-accent transition-colors',
                    emoji === e && 'bg-accent ring-2 ring-primary'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-9 w-9 rounded-full transition-transform',
                    color === c && 'ring-2 ring-primary ring-offset-2 scale-110'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!name.trim()}>
            {initialData ? 'Save Changes' : 'Add Player'}
          </Button>

          {initialData && onDelete && (
            <div className="pt-2 border-t">
              {confirmDelete ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => { onDelete(); onOpenChange(false); }}
                    className="flex-1"
                  >
                    Yes, Delete
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full text-destructive hover:text-destructive"
                >
                  Delete Player
                </Button>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
