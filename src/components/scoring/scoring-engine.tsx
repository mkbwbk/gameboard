'use client';

import type { Player } from '@/lib/models/player';
import type { Game } from '@/lib/models/game';
import type { GameSession } from '@/lib/models/session';
import type { ScoreData, RaceScore, RoundBasedScore, WinLossScore, FinalScoreResult, EloScore, CooperativeScore } from '@/lib/models/score';
import { ScoringType } from '@/lib/models/game';
import { RaceScorer } from './race-scorer';
import { RoundScorer } from './round-scorer';
import { WinLossScorer } from './win-loss-scorer';
import { FinalScoreScorer } from './final-score-scorer';
import { EloScorer } from './elo-scorer';
import { CooperativeScorer } from './cooperative-scorer';
import { saveScore } from '@/lib/hooks/use-scores';
import { completeSession } from '@/lib/hooks/use-session';
import { generateId } from '@/lib/utils';
import { calculateNewRatings, DEFAULT_RATING } from '@/lib/scoring/elo';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db/database';

interface ScoringEngineProps {
  session: GameSession;
  game: Game;
  players: Player[];
  existingScore?: ScoreData;
}

export function ScoringEngine({ session, game, players, existingScore }: ScoringEngineProps) {
  const router = useRouter();

  async function handleRaceComplete(winnerId: string) {
    const score = existingScore as RaceScore | undefined;
    const finalScore: RaceScore = {
      id: score?.id ?? generateId(),
      type: 'race',
      sessionId: session.id,
      rounds: score?.rounds ?? [],
      scores: score?.scores ?? {},
      winnerId,
      targetScore: game.config.targetScore ?? 7,
    };
    await saveScore(finalScore);
    await completeSession(session.id);
    router.push(`/session/${session.id}/complete`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleRoundComplete(winnerId: string) {
    const score = existingScore as RoundBasedScore | undefined;
    if (score) {
      // Score is already saved by the round scorer
      await completeSession(session.id);
      router.push(`/session/${session.id}/complete`);
    }
  }

  async function handleWinLossComplete(winnerId: string, loserId?: string) {
    const scoreData: WinLossScore = {
      id: generateId(),
      type: 'win_loss',
      sessionId: session.id,
      winnerId,
      loserId: loserId && loserId !== 'skip' ? loserId : undefined,
      placements: [winnerId, ...players.filter((p) => p.id !== winnerId).map((p) => p.id)],
    };
    await saveScore(scoreData);
    await completeSession(session.id);
    router.push(`/session/${session.id}/complete`);
  }

  async function handleFinalScoreComplete(scores: Record<string, number>) {
    const scoreData: FinalScoreResult = {
      id: generateId(),
      type: 'final_score',
      sessionId: session.id,
      scores,
    };
    await saveScore(scoreData);
    await completeSession(session.id);
    router.push(`/session/${session.id}/complete`);
  }

  async function handleEloComplete(result: 'player1_win' | 'player2_win' | 'draw') {
    const player1 = players[0];
    const player2 = players[1];

    // Get current ratings
    const getLatestRating = async (playerId: string) => {
      const sessions = await db.sessions
        .where('gameId')
        .equals(game.id)
        .filter((s) => s.status === 'completed' && s.playerIds.includes(playerId))
        .sortBy('completedAt');

      if (sessions.length === 0) return DEFAULT_RATING;
      const lastSession = sessions[sessions.length - 1];
      const score = await db.scores.where('sessionId').equals(lastSession.id).first() as EloScore | undefined;
      return score?.playerResults?.[playerId]?.ratingAfter ?? DEFAULT_RATING;
    };

    const rating1 = await getLatestRating(player1.id);
    const rating2 = await getLatestRating(player2.id);

    const scoreA = result === 'player1_win' ? 1 : result === 'draw' ? 0.5 : 0;
    const { newRatingA, newRatingB } = calculateNewRatings(rating1, rating2, scoreA);

    const scoreData: EloScore = {
      id: generateId(),
      type: 'elo',
      sessionId: session.id,
      result,
      playerResults: {
        [player1.id]: {
          outcome: result === 'player1_win' ? 'win' : result === 'draw' ? 'draw' : 'loss',
          ratingBefore: rating1,
          ratingAfter: newRatingA,
        },
        [player2.id]: {
          outcome: result === 'player2_win' ? 'win' : result === 'draw' ? 'draw' : 'loss',
          ratingBefore: rating2,
          ratingAfter: newRatingB,
        },
      },
    };
    await saveScore(scoreData);
    await completeSession(session.id);
    router.push(`/session/${session.id}/complete`);
  }

  async function handleCooperativeComplete(levelReached: number, won: boolean) {
    const scoreData: CooperativeScore = {
      id: generateId(),
      type: 'cooperative',
      sessionId: session.id,
      levelReached,
      won,
    };
    await saveScore(scoreData);
    await completeSession(session.id);
    router.push(`/session/${session.id}/complete`);
  }

  switch (game.scoringType) {
    case ScoringType.RACE:
      return (
        <RaceScorer
          session={session}
          game={game}
          players={players}
          existingScore={existingScore as RaceScore}
          onComplete={handleRaceComplete}
        />
      );

    case ScoringType.ROUND_BASED:
      return (
        <RoundScorer
          session={session}
          game={game}
          players={players}
          existingScore={existingScore as RoundBasedScore}
          onComplete={handleRoundComplete}
        />
      );

    case ScoringType.WIN_LOSS:
      return (
        <WinLossScorer
          session={session}
          game={game}
          players={players}
          onComplete={handleWinLossComplete}
        />
      );

    case ScoringType.FINAL_SCORE:
      return (
        <FinalScoreScorer
          session={session}
          game={game}
          players={players}
          onComplete={handleFinalScoreComplete}
        />
      );

    case ScoringType.ELO:
      return (
        <EloScorer
          session={session}
          game={game}
          players={players}
          onComplete={handleEloComplete}
        />
      );

    case ScoringType.COOPERATIVE:
      return (
        <CooperativeScorer
          session={session}
          game={game}
          players={players}
          onComplete={handleCooperativeComplete}
        />
      );

    default:
      return <p>Unknown scoring type</p>;
  }
}
