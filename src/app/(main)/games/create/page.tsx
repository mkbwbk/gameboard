'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGames } from '@/lib/hooks/use-games';
import { ScoringType } from '@/lib/models/game';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const GAME_EMOJIS = [
  '🎲', '🃏', '🎯', '🏆', '🎪', '🎨', '🧩', '🀄',
  '🎳', '🏓', '🎱', '⚽', '🏀', '🎾', '🏐', '🎣',
  '🎮', '🕹️', '♠️', '♥️', '♦️', '♣️', '🪄', '🎰',
];

const scoringTypeDescriptions: Record<ScoringType, string> = {
  [ScoringType.RACE]: 'First player to reach a target score (e.g. Backgammon)',
  [ScoringType.ROUND_BASED]: 'Score each round, totals determine winner (e.g. Flip 7)',
  [ScoringType.WIN_LOSS]: 'Simply record who won (e.g. Monopoly Deal)',
  [ScoringType.FINAL_SCORE]: 'Each player enters their final score (e.g. Wingspan)',
  [ScoringType.ELO]: 'Win/loss/draw with ELO ratings (e.g. Chess)',
  [ScoringType.COOPERATIVE]: 'Cooperative — track the level your team reaches (e.g. The Mind)',
};

export default function CreateGamePage() {
  const router = useRouter();
  const { addGame } = useGames();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎲');
  const [scoringType, setScoringType] = useState<ScoringType | ''>('');
  const [minPlayers, setMinPlayers] = useState('2');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [targetScore, setTargetScore] = useState('10');
  const [trackLastPlace, setTrackLastPlace] = useState(false);
  const [allowDraw, setAllowDraw] = useState(false);
  const [lowestWins, setLowestWins] = useState(false);

  const canSubmit = name.trim() && scoringType;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !scoringType) return;

    await addGame({
      name: name.trim(),
      scoringType,
      icon,
      config: {
        minPlayers: parseInt(minPlayers) || 2,
        maxPlayers: parseInt(maxPlayers) || 4,
        ...(scoringType === ScoringType.RACE && { targetScore: parseInt(targetScore) || 10 }),
        ...(scoringType === ScoringType.WIN_LOSS && { trackLastPlace }),
        ...(scoringType === ScoringType.ELO && { allowDraw }),
        ...(scoringType === ScoringType.ROUND_BASED && { lowestWins }),
      },
    });

    router.push('/games');
  }

  return (
    <PageContainer>
      <Link
        href="/games"
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Games
      </Link>

      <h2 className="text-lg font-bold mb-4">Create Custom Game</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Icon picker */}
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="grid grid-cols-8 gap-1">
            {GAME_EMOJIS.map((e) => (
              <button
                key={e}
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

        {/* Scoring type */}
        <div className="space-y-2">
          <Label>Scoring Type</Label>
          <Select value={scoringType} onValueChange={(v) => setScoringType(v as ScoringType)}>
            <SelectTrigger>
              <SelectValue placeholder="How is this game scored?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ScoringType.WIN_LOSS}>Win / Loss</SelectItem>
              <SelectItem value={ScoringType.FINAL_SCORE}>Final Score</SelectItem>
              <SelectItem value={ScoringType.ROUND_BASED}>Round-Based</SelectItem>
              <SelectItem value={ScoringType.RACE}>Race (First to X)</SelectItem>
              <SelectItem value={ScoringType.COOPERATIVE}>Cooperative</SelectItem>
              <SelectItem value={ScoringType.ELO}>ELO Rated</SelectItem>
            </SelectContent>
          </Select>
          {scoringType && (
            <p className="text-xs text-muted-foreground">
              {scoringTypeDescriptions[scoringType]}
            </p>
          )}
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
        {scoringType === ScoringType.RACE && (
          <div className="space-y-2">
            <Label htmlFor="targetScore">Target Score</Label>
            <Input
              id="targetScore"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              min={1}
              placeholder="First to..."
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
                <span className="text-sm">Track last place (like Shithead)</span>
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
                <span className="text-sm">Lowest score wins (like golf scoring)</span>
              </label>
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          Create Game
        </Button>
      </form>
    </PageContainer>
  );
}
