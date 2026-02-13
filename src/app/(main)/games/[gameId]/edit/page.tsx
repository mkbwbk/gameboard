'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, useGames } from '@/lib/hooks/use-games';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ScoringType } from '@/lib/models/game';

const GAME_EMOJIS = [
  '🎲', '🃏', '🎯', '🏆', '🎪', '🎨', '🧩', '🀄',
  '🎳', '🏓', '🎱', '⚽', '🏀', '🎾', '🏐', '🎣',
  '🎮', '🕹️', '♠️', '♥️', '♦️', '♣️', '🪄', '🎰',
];

export default function EditGamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();
  const game = useGame(gameId);
  const { updateGame, deleteGame } = useGames();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎲');
  const [minPlayers, setMinPlayers] = useState('2');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [targetScore, setTargetScore] = useState('');
  const [trackLastPlace, setTrackLastPlace] = useState(false);
  const [allowDraw, setAllowDraw] = useState(false);
  const [lowestWins, setLowestWins] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load game data into form
  useEffect(() => {
    if (game && !loaded) {
      setName(game.name);
      setIcon(game.icon);
      setMinPlayers(String(game.config.minPlayers));
      setMaxPlayers(String(game.config.maxPlayers));
      setTargetScore(game.config.targetScore ? String(game.config.targetScore) : '');
      setTrackLastPlace(game.config.trackLastPlace ?? false);
      setAllowDraw(game.config.allowDraw ?? false);
      setLowestWins(game.config.lowestWins ?? false);
      setLoaded(true);
    }
  }, [game, loaded]);

  if (!game) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  const canSubmit = name.trim().length > 0;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !game) return;

    await updateGame(game.id, {
      name: name.trim(),
      icon,
      config: {
        ...game.config,
        minPlayers: parseInt(minPlayers) || 2,
        maxPlayers: parseInt(maxPlayers) || 4,
        ...(targetScore ? { targetScore: parseInt(targetScore) } : {}),
        trackLastPlace,
        allowDraw,
        lowestWins,
      },
    });

    router.push(`/games/${game.id}`);
  }

  async function handleDelete() {
    if (!game) return;
    await deleteGame(game.id);
    router.push('/games');
  }

  const scoringType = game.scoringType;

  return (
    <PageContainer>
      <Link
        href={`/games/${gameId}`}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {game.name}
      </Link>

      <h2 className="text-lg font-bold mb-4">Edit Game</h2>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Icon picker */}
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="grid grid-cols-8 gap-1">
            {GAME_EMOJIS.map((e, i) => (
              <button
                key={`${e}-${i}`}
                type="button"
                onClick={() => setIcon(e)}
                className={cn(
                  'h-10 w-10 flex items-center justify-center rounded-md text-xl hover:bg-accent transition-colors',
                  icon === e && 'bg-accent ring-2 ring-primary'
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="gameName">Game Name</Label>
          <Input
            id="gameName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Catan, Uno, Scrabble..."
            maxLength={30}
          />
        </div>

        {/* Scoring type (read-only) */}
        <div className="space-y-2">
          <Label>Scoring Type</Label>
          <p className="text-sm text-muted-foreground bg-muted rounded-md px-3 py-2 capitalize">
            {scoringType.replace('_', ' ')}
          </p>
        </div>

        {/* Player count */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="minPlayers">Min Players</Label>
            <Input
              id="minPlayers"
              type="number"
              value={minPlayers}
              onChange={(e) => setMinPlayers(e.target.value)}
              min={1}
              max={20}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Max Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              min={1}
              max={20}
            />
          </div>
        </div>

        {/* Type-specific options */}
        {(scoringType === ScoringType.RACE || scoringType === ScoringType.ROUND_BASED) && (
          <div className="space-y-2">
            <Label htmlFor="targetScore">Target Score</Label>
            <Input
              id="targetScore"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              min={1}
              placeholder={scoringType === ScoringType.RACE ? 'First to...' : 'Optional — auto-finish at...'}
            />
          </div>
        )}

        {scoringType === ScoringType.WIN_LOSS && (
          <Card>
            <CardContent className="p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trackLastPlace}
                  onChange={(e) => setTrackLastPlace(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Track last place</span>
              </label>
            </CardContent>
          </Card>
        )}

        {scoringType === ScoringType.ELO && (
          <Card>
            <CardContent className="p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDraw}
                  onChange={(e) => setAllowDraw(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Allow draws</span>
              </label>
            </CardContent>
          </Card>
        )}

        {scoringType === ScoringType.ROUND_BASED && (
          <Card>
            <CardContent className="p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowestWins}
                  onChange={(e) => setLowestWins(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Lowest score wins</span>
              </label>
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          Save Changes
        </Button>
      </form>

      {/* Delete section */}
      <div className="mt-8 pt-6 border-t">
        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Game
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-destructive text-center">
              This will delete the game. Session history will be kept.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
