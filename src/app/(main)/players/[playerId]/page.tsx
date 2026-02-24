'use client';

import { use, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { PageContainer } from '@/components/layout/page-container';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { computePlayerStats, type PlayerProfileStats } from '@/lib/stats/player-stats';
import Link from 'next/link';

export default function PlayerProfilePage({ params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = use(params);
  const player = useLiveQuery(() => db.players.get(playerId), [playerId]);

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions
      .filter((s) => s.status === 'completed' && s.playerIds.includes(playerId))
      .toArray();
    return sessions.length;
  }, [playerId]) ?? 0;

  const [stats, setStats] = useState<PlayerProfileStats | null>(null);
  useEffect(() => {
    computePlayerStats(playerId).then(setStats);
  }, [playerId, completedCount]);

  if (!player) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Player header */}
      <div className="flex items-center gap-4 mb-6">
        <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="lg" />
        <div>
          <h2 className="text-2xl font-bold">{player.name}</h2>
          {stats && stats.totalGames > 0 && (
            <p className="text-sm text-muted-foreground">
              {stats.totalGames} game{stats.totalGames !== 1 ? 's' : ''} played
            </p>
          )}
        </div>
      </div>

      {!stats || stats.totalGames === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-3">No games played yet!</p>
            <Button asChild>
              <Link href="/session/new">Start a Game</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{stats.totalWins}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{Math.round(stats.overallWinRate * 100)}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">
                  {stats.currentStreak > 0 ? `${stats.currentStreak}🔥` : stats.currentStreak < 0 ? `${Math.abs(stats.currentStreak)}🥶` : '—'}
                </p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent form */}
          {stats.recentForm.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Form</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1.5 justify-center">
                  {stats.recentForm.map((isWin, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isWin
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {isWin ? 'W' : 'L'}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Last {stats.recentForm.length} game{stats.recentForm.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Best / Worst Game */}
          {(stats.bestGame || stats.worstGame) && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.bestGame && (
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl mb-1">{stats.bestGame.gameIcon}</p>
                    <p className="text-xs font-semibold truncate">{stats.bestGame.gameName}</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      {Math.round(stats.bestGame.winRate * 100)}% win
                    </p>
                    <p className="text-[10px] text-muted-foreground">Best Game</p>
                  </CardContent>
                </Card>
              )}
              {stats.worstGame && (
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl mb-1">{stats.worstGame.gameIcon}</p>
                    <p className="text-xs font-semibold truncate">{stats.worstGame.gameName}</p>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      {Math.round(stats.worstGame.winRate * 100)}% win
                    </p>
                    <p className="text-[10px] text-muted-foreground">Worst Game</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Per-game breakdown */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Per-Game Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.perGame.map((g) => (
                <Link
                  key={g.gameId}
                  href={`/games/${g.gameId}`}
                  className="flex items-center gap-3 hover:bg-accent rounded-lg p-1.5 -mx-1.5 transition-colors"
                >
                  <span className="text-xl shrink-0">{g.gameIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{g.gameName}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.gamesPlayed} game{g.gamesPlayed !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{Math.round(g.winRate * 100)}%</p>
                    <p className="text-xs text-muted-foreground">{g.wins}W / {g.gamesPlayed - g.wins}L</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      <Button asChild className="w-full">
        <Link href={`/session/new`}>Start New Game</Link>
      </Button>
    </PageContainer>
  );
}
