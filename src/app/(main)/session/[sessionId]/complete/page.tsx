'use client';

import { use, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { useSession, updateSessionNotes, deleteSession } from '@/lib/hooks/use-session';
import { useGame } from '@/lib/hooks/use-games';
import { useScore } from '@/lib/hooks/use-scores';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/database';
import { PageContainer } from '@/components/layout/page-container';
import { PlayerAvatar } from '@/components/players/player-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Player } from '@/lib/models/player';
import type { WinLossScore, FinalScoreResult, RaceScore, RoundBasedScore, EloScore, CooperativeScore } from '@/lib/models/score';

export default function SessionCompletePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const session = useSession(sessionId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const game = useGame(session?.gameId);
  const score = useScore(sessionId);

  const players = useLiveQuery(async () => {
    if (!session) return [];
    const all = await db.players.bulkGet(session.playerIds);
    return all.filter(Boolean) as Player[];
  }, [session?.playerIds]) ?? [];

  // Fire confetti on first load
  const confettiFired = useRef(false);
  useEffect(() => {
    if (session && score && !confettiFired.current) {
      confettiFired.current = true;
      // Staggered bursts for a nicer effect
      const fire = (opts: confetti.Options) =>
        confetti({ ...opts, disableForReducedMotion: true });

      fire({ particleCount: 60, spread: 55, origin: { x: 0.3, y: 0.6 } });
      setTimeout(() => fire({ particleCount: 60, spread: 55, origin: { x: 0.7, y: 0.6 } }), 150);
      setTimeout(() => fire({ particleCount: 40, spread: 100, origin: { x: 0.5, y: 0.5 } }), 300);
    }
  }, [session, score]);

  if (!session || !game || !score) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading...</p>
      </PageContainer>
    );
  }

  const getPlayer = (id: string) => players.find((p) => p.id === id);

  return (
    <PageContainer>
      <div className="text-center mb-6">
        <span className="text-5xl block mb-2">🏆</span>
        <h2 className="text-2xl font-bold">Game Complete!</h2>
        <p className="text-muted-foreground">{game.icon} {game.name}</p>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent>
          {score.type === 'win_loss' && (() => {
            const s = score as WinLossScore;
            const winner = getPlayer(s.winnerId);
            return (
              <div className="space-y-3">
                {winner && (
                  <div className="flex items-center gap-3">
                    <PlayerAvatar emoji={winner.avatarEmoji} color={winner.avatarColor} />
                    <div>
                      <p className="font-bold">{winner.name} 🏆</p>
                      <p className="text-xs text-muted-foreground">Winner</p>
                    </div>
                  </div>
                )}
                {s.loserId && (() => {
                  const loser = getPlayer(s.loserId);
                  return loser ? (
                    <div className="flex items-center gap-3">
                      <PlayerAvatar emoji={loser.avatarEmoji} color={loser.avatarColor} />
                      <div>
                        <p className="font-medium">{loser.name} 💩</p>
                        <p className="text-xs text-muted-foreground">Last Place</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            );
          })()}

          {score.type === 'final_score' && (() => {
            const s = score as FinalScoreResult;
            const sorted = Object.entries(s.scores).sort(([, a], [, b]) => b - a);
            return (
              <div className="space-y-2">
                {sorted.map(([playerId, pts], index) => {
                  const player = getPlayer(playerId);
                  if (!player) return null;
                  return (
                    <div key={playerId} className="flex items-center gap-3">
                      <span className="text-sm font-bold w-6">{index + 1}.</span>
                      <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
                      <span className="flex-1 font-medium text-sm">{player.name}</span>
                      <span className="font-bold">{pts} pts</span>
                      {index === 0 && <span>🏆</span>}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {score.type === 'race' && (() => {
            const s = score as RaceScore;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-8">
                  {players.map((player) => (
                    <div key={player.id} className="flex flex-col items-center gap-1">
                      <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} />
                      <span className="text-sm font-medium">{player.name}</span>
                      <span className="text-2xl font-bold">{s.scores[player.id] ?? 0}</span>
                      {player.id === s.winnerId && <span>🏆</span>}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {s.rounds.length} rounds played
                </p>
              </div>
            );
          })()}

          {score.type === 'round_based' && (() => {
            const s = score as RoundBasedScore;
            const sorted = Object.entries(s.finalTotals).sort(([, a], [, b]) => {
              return game.config.lowestWins ? a - b : b - a;
            });
            return (
              <div className="space-y-2">
                {sorted.map(([playerId, pts], index) => {
                  const player = getPlayer(playerId);
                  if (!player) return null;
                  return (
                    <div key={playerId} className="flex items-center gap-3">
                      <span className="text-sm font-bold w-6">{index + 1}.</span>
                      <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
                      <span className="flex-1 font-medium text-sm">{player.name}</span>
                      <span className="font-bold">{pts} pts</span>
                      {index === 0 && <span>🏆</span>}
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {s.rounds.length} rounds played
                </p>
              </div>
            );
          })()}

          {score.type === 'cooperative' && (() => {
            const s = score as CooperativeScore;
            return (
              <div className="text-center space-y-3">
                <span className="text-4xl">{s.won ? '🎉' : '😵'}</span>
                <p className="text-lg font-bold">
                  {s.won ? 'Team Won!' : 'Game Over'}
                </p>
                <p className="text-3xl font-bold">Level {s.levelReached}</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {players.map((p) => (
                    <PlayerAvatar key={p.id} emoji={p.avatarEmoji} color={p.avatarColor} size="sm" />
                  ))}
                </div>
              </div>
            );
          })()}

          {score.type === 'elo' && (() => {
            const s = score as EloScore;
            return (
              <div className="space-y-3">
                {Object.entries(s.playerResults).map(([playerId, result]) => {
                  const player = getPlayer(playerId);
                  if (!player) return null;
                  const diff = result.ratingAfter - result.ratingBefore;
                  return (
                    <div key={playerId} className="flex items-center gap-3">
                      <PlayerAvatar emoji={player.avatarEmoji} color={player.avatarColor} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {player.name} {result.outcome === 'win' ? '🏆' : result.outcome === 'draw' ? '🤝' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.ratingBefore} → {result.ratingAfter} (
                          <span className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : ''}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                          )
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Session Notes */}
      <SessionNotes sessionId={session.id} existingNotes={session.notes} />

      <div className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/history">View History</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/session/new?gameId=${session.gameId}&players=${session.playerIds.join(',')}`}>Play Again</Link>
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t">
        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Session
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-destructive text-center">
              This will permanently delete this session and its scores.
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
                onClick={async () => {
                  await deleteSession(session.id);
                  router.push('/history');
                }}
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

function SessionNotes({ sessionId, existingNotes }: { sessionId: string; existingNotes?: string }) {
  const [notes, setNotes] = useState(existingNotes ?? '');
  const [saved, setSaved] = useState(!!existingNotes);

  async function handleSave() {
    await updateSessionNotes(sessionId, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Notes</span>
          {saved && <span className="text-xs text-green-600 ml-auto">Saved!</span>}
        </div>
        <div className="flex gap-2">
          <Input
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            placeholder="Add a note about this game..."
            className="flex-1 text-sm"
          />
          <Button size="sm" variant="outline" onClick={handleSave} disabled={notes === (existingNotes ?? '')}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
