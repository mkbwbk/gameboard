'use client';

import { use, useState, useEffect } from 'react';
import { useGame, useGames } from '@/lib/hooks/use-games';
import { PageContainer } from '@/components/layout/page-container';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { computeLeaderboard, type LeaderboardEntry } from '@/lib/stats/leaderboard';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { GameWinDistributionChart } from '@/components/dashboard/game-win-distribution-chart';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const scoringTypeDescriptions: Record<string, string> = {
  race: 'First player to reach the target score wins.',
  round_based: 'Points are scored each round. Totals determine the winner.',
  win_loss: 'The winner of each game is recorded.',
  final_score: 'Each player enters their final score. Highest wins.',
  elo: 'Win/loss/draw with ELO rating tracking.',
  cooperative: 'Cooperative game — track the level your team reaches.',
};

const categoryLabels: Record<string, string> = {
  strategy: 'Strategy',
  party: 'Party',
  family: 'Family',
  card_games: 'Card Games',
  classic: 'Classic',
  cooperative: 'Co-op',
};

export default function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const game = useGame(gameId);
  const { toggleFavourite } = useGames();

  const completedCount = useLiveQuery(async () => {
    const sessions = await db.sessions
      .filter((s) => s.status === 'completed' && s.gameId === gameId)
      .toArray();
    return sessions.length;
  }, [gameId]) ?? 0;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  useEffect(() => {
    if (gameId) {
      computeLeaderboard(gameId).then(setLeaderboard);
    }
  }, [gameId, completedCount]);

  if (!game) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{game.icon}</span>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{game.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{game.scoringType.replace('_', ' ')}</Badge>
            {game.category && (
              <Badge variant="outline">{categoryLabels[game.category] ?? game.category}</Badge>
            )}
            {completedCount > 0 && (
              <span className="text-xs text-muted-foreground">{completedCount} games</span>
            )}
          </div>
        </div>
        <button
          onClick={() => toggleFavourite(game.id)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Heart
            className={cn(
              'h-6 w-6',
              game.isFavourite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            )}
          />
        </button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>{scoringTypeDescriptions[game.scoringType]}</p>
          <div className="mt-3 space-y-1">
            <p>Players: {game.config.minPlayers}-{game.config.maxPlayers}</p>
            {game.playTime && <p>Play time: {game.playTime}</p>}
            {game.config.targetScore && <p>Target score: {game.config.targetScore}</p>}
            {game.config.trackLastPlace && <p>Tracks last place</p>}
            {game.config.allowDraw && <p>Draws allowed</p>}
            {game.config.lowestWins && <p>Lowest score wins</p>}
          </div>
        </CardContent>
      </Card>

      {game.youtubeVideoId && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Learn How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${game.youtubeVideoId}`}
                title={`How to play ${game.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={entry.player.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold w-6 text-muted-foreground">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                  </span>
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
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Play some {game.name} to see the leaderboard!
            </p>
          )}
        </CardContent>
      </Card>

      {completedCount > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Win Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <GameWinDistributionChart gameId={gameId} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Button asChild className="w-full">
          <Link href={`/session/new?gameId=${game.id}`}>Play {game.name}</Link>
        </Button>
        {game.amazonUrl && (
          <Button asChild variant="outline" className="w-full">
            <a href={game.amazonUrl} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Buy This Game
            </a>
          </Button>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href={`/games/${game.id}/edit`}>Edit Settings</Link>
        </Button>
      </div>

    </PageContainer>
  );
}
