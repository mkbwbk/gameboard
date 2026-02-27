'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/shared/empty-state';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { SessionCard } from '@/components/history/session-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { computeLeaderboard, type LeaderboardEntry } from '@/lib/stats/leaderboard';
import { computeHeadToHead, type HeadToHeadRecord } from '@/lib/stats/head-to-head';
import { WinRateChart } from '@/components/dashboard/win-rate-chart';
import { GamesPlayedChart } from '@/components/dashboard/games-played-chart';
import { GameDistributionChart } from '@/components/dashboard/game-distribution-chart';
import { PlayerWinsChart } from '@/components/dashboard/player-wins-chart';
import { StreaksCard } from '@/components/dashboard/streaks-card';
import type { Player } from '@/lib/models/player';
import type { ScoreData } from '@/lib/models/score';

export default function DashboardPage() {
  const router = useRouter();

  const players = useLiveQuery(() => db.players.toArray()) ?? [];
  const sessions = useLiveQuery(() => db.sessions.orderBy('startedAt').reverse().toArray()) ?? [];
  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  useEffect(() => {
    computeLeaderboard().then(setLeaderboard);
  }, [completedCount]);

  // Head-to-head
  const [h2hPlayer1, setH2hPlayer1] = useState<string>('');
  const [h2hPlayer2, setH2hPlayer2] = useState<string>('');
  const [h2hRecord, setH2hRecord] = useState<HeadToHeadRecord | null>(null);
  const h2hValid = h2hPlayer1 && h2hPlayer2 && h2hPlayer1 !== h2hPlayer2;
  useEffect(() => {
    if (h2hValid) {
      computeHeadToHead(h2hPlayer1, h2hPlayer2).then(setH2hRecord);
    } else {
      Promise.resolve().then(() => setH2hRecord(null));
    }
  }, [h2hValid, h2hPlayer1, h2hPlayer2, completedCount]);

  // Recent games data
  const recentData = useLiveQuery(async () => {
    const recentSessions = await db.sessions
      .orderBy('startedAt')
      .reverse()
      .limit(5)
      .toArray();

    const allPlayers = await db.players.toArray();
    const allGames = await db.games.toArray();
    const allScores = await db.scores.toArray();

    const playerMap = new Map(allPlayers.map((p) => [p.id, p]));
    const gameMap = new Map(allGames.map((g) => [g.id, g]));
    const scoreMap = new Map(allScores.map((s) => [s.sessionId, s]));

    return recentSessions
      .map((session) => ({
        session,
        game: gameMap.get(session.gameId)!,
        players: session.playerIds.map((id) => playerMap.get(id)).filter(Boolean) as Player[],
        score: scoreMap.get(session.id) as ScoreData | undefined,
      }))
      .filter((item) => item.game);
  }) ?? [];

  // Show welcome if no games played
  if (sessions.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon="🏆"
          title="Welcome to Score Door"
          description="Start by adding players and playing your first game!"
        >
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/players">Add Players</Link>
            </Button>
            <Button asChild>
              <Link href="/session/new">New Game</Link>
            </Button>
          </div>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Games</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{players.length}</p>
            <p className="text-xs text-muted-foreground">Players</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">
              {leaderboard[0]?.winRate ? `${Math.round(leaderboard[0].winRate * 100)}%` : '-'}
            </p>
            <p className="text-xs text-muted-foreground">Top Win %</p>
          </CardContent>
        </Card>
      </div>

      {/* New game button */}
      <Button asChild className="w-full mb-6">
        <Link href="/session/new">New Game</Link>
      </Button>

      {/* Recent games */}
      {recentData.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Games</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentData.map((item) => (
              <SessionCard
                key={item.session.id}
                session={item.session}
                game={item.game}
                players={item.players}
                score={item.score}
                onClick={() =>
                  item.session.status === 'in_progress'
                    ? router.push(`/session/${item.session.id}`)
                    : router.push(`/session/${item.session.id}/complete`)
                }
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div key={entry.player.id} className="flex items-center gap-3">
                <span className="text-sm font-bold w-6 text-muted-foreground">{index + 1}</span>
                <PlayerAvatar
                  emoji={entry.player.avatarEmoji}
                  color={entry.player.avatarColor}
                  size="sm"
                />
                <span className="flex-1 font-medium text-sm">{entry.player.name}</span>
                <div className="text-right">
                  <p className="text-sm font-bold">{Math.round(entry.winRate * 100)}%</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.wins}W / {entry.gamesPlayed}G
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Streaks & Rivalries */}
      {completedCount > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Streaks & Rivalries</CardTitle>
          </CardHeader>
          <CardContent>
            <StreaksCard />
          </CardContent>
        </Card>
      )}

      {/* Head-to-Head */}
      {players.length >= 2 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Head-to-Head</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Select value={h2hPlayer1} onValueChange={setH2hPlayer1}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Player 1" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.avatarEmoji} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center text-sm text-muted-foreground">vs</span>
              <Select value={h2hPlayer2} onValueChange={setH2hPlayer2}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Player 2" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.avatarEmoji} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {h2hRecord && h2hRecord.totalGames > 0 ? (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{h2hRecord.player1Wins}</p>
                    <p className="text-xs text-muted-foreground">
                      {players.find((p) => p.id === h2hPlayer1)?.name}
                    </p>
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{h2hRecord.player2Wins}</p>
                    <p className="text-xs text-muted-foreground">
                      {players.find((p) => p.id === h2hPlayer2)?.name}
                    </p>
                  </div>
                </div>
                {h2hRecord.draws > 0 && (
                  <p className="text-xs text-muted-foreground">{h2hRecord.draws} draws</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {h2hRecord.totalGames} games together
                </p>
              </div>
            ) : h2hRecord && h2hRecord.totalGames === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No games played together yet
              </p>
            ) : h2hPlayer1 && h2hPlayer2 && h2hPlayer1 === h2hPlayer2 ? (
              <p className="text-sm text-muted-foreground text-center">
                Select two different players
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      {completedCount > 0 && (
        <>
          {/* Player Wins & Losses */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Wins & Losses</CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerWinsChart />
            </CardContent>
          </Card>

          {/* Win Rate Over Time */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Win Rate Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <WinRateChart />
            </CardContent>
          </Card>

          {/* Games Per Week */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Games Per Week</CardTitle>
            </CardHeader>
            <CardContent>
              <GamesPlayedChart />
            </CardContent>
          </Card>

          {/* Game Distribution */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Most Played Games</CardTitle>
            </CardHeader>
            <CardContent>
              <GameDistributionChart />
            </CardContent>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
