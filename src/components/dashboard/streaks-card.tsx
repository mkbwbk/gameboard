'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { computeStreaks, computeRivalries, type PlayerStreak, type Rivalry } from '@/lib/stats/aggregations';

export function StreaksCard() {
  const [streaks, setStreaks] = useState<PlayerStreak[]>([]);
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions.filter((s) => s.status === 'completed').toArray();
    return sessions.length;
  }) ?? 0;

  useEffect(() => {
    computeStreaks().then(setStreaks);
    computeRivalries().then(setRivalries);
  }, [completedCount]);

  if (streaks.length === 0) return null;

  // Find notable streaks
  const hotStreak = streaks.find((s) => s.currentStreak >= 2);
  const coldStreak = streaks.find((s) => s.currentStreak <= -2);
  const bestEver = [...streaks].sort((a, b) => b.longestWinStreak - a.longestWinStreak)[0];

  return (
    <div className="space-y-3">
      {/* Current streaks */}
      {hotStreak && (
        <div className="flex items-center gap-2">
          <span className="text-lg">{hotStreak.player.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{hotStreak.player.name}</p>
            <p className="text-xs text-muted-foreground">
              🔥 {hotStreak.currentStreak} win streak
            </p>
          </div>
        </div>
      )}

      {coldStreak && (
        <div className="flex items-center gap-2">
          <span className="text-lg">{coldStreak.player.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{coldStreak.player.name}</p>
            <p className="text-xs text-muted-foreground">
              🥶 {Math.abs(coldStreak.currentStreak)} loss streak
            </p>
          </div>
        </div>
      )}

      {bestEver && bestEver.longestWinStreak >= 2 && (
        <div className="flex items-center gap-2">
          <span className="text-lg">{bestEver.player.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{bestEver.player.name}</p>
            <p className="text-xs text-muted-foreground">
              👑 Best ever: {bestEver.longestWinStreak} wins in a row
            </p>
          </div>
        </div>
      )}

      {/* Top rivalry */}
      {rivalries.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Top Rivalry</p>
          {rivalries.slice(0, 1).map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>{r.player1.emoji}</span>
                <span className="text-sm font-medium">{r.player1.name}</span>
              </div>
              <div className="text-center px-2">
                <p className="text-sm font-bold">{r.player1Wins} - {r.player2Wins}</p>
                <p className="text-xs text-muted-foreground">{r.gamesPlayed} games</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{r.player2.name}</span>
                <span>{r.player2.emoji}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!hotStreak && !coldStreak && bestEver && bestEver.longestWinStreak < 2 && rivalries.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Play more games to see streaks!
        </p>
      )}
    </div>
  );
}
