import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Target,
  ListOrdered,
  Trophy,
  Hash,
  TrendingUp,
  Users,
  ArrowRight,
  ShoppingCart,
  Gamepad2,
  ChevronLeft,
} from 'lucide-react';
import { DEFAULT_GAMES, slugify, findGameBySlug } from '@/lib/constants/games';
import { ScoringType, GameCategory } from '@/lib/models/game';
import { SCORING_TYPE_FAQS, GAME_CUSTOM_FAQS } from '@/lib/constants/game-faqs';
import { AppStoreBadges } from '@/components/marketing/app-store-badges';
import { MarketingNav } from '@/components/marketing/marketing-nav';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export function generateStaticParams() {
  return DEFAULT_GAMES.map((game) => ({
    slug: slugify(game.name),
  }));
}

const scoringTypeInfo: Record<
  ScoringType,
  { label: string; icon: typeof Target; color: string; description: string; howItWorks: string }
> = {
  [ScoringType.RACE]: {
    label: 'Race to Target',
    icon: Target,
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
    description: 'Players race to be the first to reach a target score. The moment someone hits the goal, the game ends and they win.',
    howItWorks: 'Set the target score, add players, and tap to increment scores during gameplay. Points Pad highlights who is closest to winning and announces the winner automatically.',
  },
  [ScoringType.ROUND_BASED]: {
    label: 'Round-Based Scoring',
    icon: ListOrdered,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    description: 'Scores are tracked round by round, building a running total over multiple rounds of play.',
    howItWorks: 'Enter scores after each round and Points Pad keeps running totals. Review the scorecard anytime to see round-by-round breakdowns and current standings.',
  },
  [ScoringType.WIN_LOSS]: {
    label: 'Win/Loss Tracking',
    icon: Trophy,
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
    description: 'Simple winner and loser tracking for games where the final result is all that matters.',
    howItWorks: 'Just pick the winner (and optionally the last place finisher) after each game. Points Pad tracks win rates, streaks, and head-to-head records over time.',
  },
  [ScoringType.FINAL_SCORE]: {
    label: 'Final Score Comparison',
    icon: Hash,
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    description: 'Each player tallies up their final score at the end of the game. The highest (or lowest) total wins.',
    howItWorks: 'Enter each player\'s final score when the game ends. Points Pad compares totals, determines the winner, and tracks historical performance.',
  },
  [ScoringType.ELO]: {
    label: 'ELO Rating',
    icon: TrendingUp,
    color: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    description: 'A competitive skill-based rating system that adjusts after every game. Beat stronger opponents to climb faster.',
    howItWorks: 'Record game results and Points Pad automatically calculates ELO ratings. Watch ratings rise and fall based on match results and opponent strength.',
  },
  [ScoringType.COOPERATIVE]: {
    label: 'Cooperative',
    icon: Users,
    color: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    description: 'Players work together as a team. Everyone wins or loses together based on the game outcome.',
    howItWorks: 'Record whether the team won or lost each session. Points Pad tracks your group\'s win rate and performance history for cooperative games.',
  },
};

const categoryLabels: Record<GameCategory, string> = {
  [GameCategory.CLASSIC]: 'Classic',
  [GameCategory.STRATEGY]: 'Strategy',
  [GameCategory.PARTY]: 'Party',
  [GameCategory.FAMILY]: 'Family',
  [GameCategory.CARD_GAMES]: 'Card Games',
  [GameCategory.COOPERATIVE]: 'Co-op',
};

function generateFaqs(game: (typeof DEFAULT_GAMES)[number]) {
  const playerRange =
    game.config.minPlayers === game.config.maxPlayers
      ? `${game.config.minPlayers}`
      : `${game.config.minPlayers}–${game.config.maxPlayers}`;

  const replacements: Record<string, string> = {
    '{name}': game.name,
    '{target}': String(game.config.targetScore ?? ''),
    '{playerRange}': playerRange,
    '{minPlayers}': String(game.config.minPlayers),
    '{maxPlayers}': String(game.config.maxPlayers),
  };

  function applyTemplate(text: string): string {
    return Object.entries(replacements).reduce(
      (result, [key, val]) => result.replaceAll(key, val),
      text
    );
  }

  // Scoring-type-specific FAQs
  const baseFaqs = SCORING_TYPE_FAQS[game.scoringType].map((faq) => ({
    q: applyTemplate(faq.q),
    a: applyTemplate(faq.a),
  }));

  // Per-game custom FAQs (if any)
  const customFaqs = (GAME_CUSTOM_FAQS[game.name] ?? []).map((faq) => ({
    q: applyTemplate(faq.q),
    a: applyTemplate(faq.a),
  }));

  // Universal Points Pad FAQs
  const universalFaqs = [
    {
      q: `Is Points Pad free for tracking ${game.name} scores?`,
      a: `Yes, Points Pad is completely free with no ads, no subscriptions, and no in-app purchases. Track unlimited ${game.name} games with full stats and analytics.`,
    },
    {
      q: `Does Points Pad work offline for ${game.name}?`,
      a: `Yes, Points Pad works 100% offline. All your ${game.name} scores and stats are stored on your device. No internet connection needed during game night.`,
    },
  ];

  return [...baseFaqs, ...customFaqs, ...universalFaqs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = findGameBySlug(slug);
  if (!game) return {};

  const scoring = scoringTypeInfo[game.scoringType];
  const title = `${game.name} Score Tracker — Free ${scoring.label} Scorekeeper | Points Pad`;
  const description = `Track ${game.name} scores with Points Pad. ${scoring.label} scoring for ${game.config.minPlayers}–${game.config.maxPlayers} players. Free, offline, no sign-up. Stats, leaderboards, and win tracking.`;

  return {
    title,
    description,
    keywords: [
      `${game.name.toLowerCase()} score tracker`,
      `${game.name.toLowerCase()} scorekeeper`,
      `${game.name.toLowerCase()} scoring`,
      `how to score ${game.name.toLowerCase()}`,
      'board game score tracker',
      'score counter',
      'game night tracker',
    ],
    openGraph: {
      title,
      description,
      url: `https://pointspad.com/game/${slug}`,
      siteName: 'Points Pad',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      type: 'article',
    },
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = findGameBySlug(slug);
  if (!game) notFound();

  const scoring = scoringTypeInfo[game.scoringType];
  const ScoringIcon = scoring.icon;
  const faqs = generateFaqs(game);
  const playerRange =
    game.config.minPlayers === game.config.maxPlayers
      ? `${game.config.minPlayers}`
      : `${game.config.minPlayers}–${game.config.maxPlayers}`;

  // Find related games (same category, excluding current)
  const relatedGames = DEFAULT_GAMES.filter(
    (g) => g.category === game.category && g.name !== game.name
  ).slice(0, 6);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Points Pad — ${game.name} Score Tracker`,
    applicationCategory: 'GameApplication',
    operatingSystem: 'iOS, Android, Web',
    description: `Track ${game.name} scores with Points Pad. Free, offline score tracker with stats and leaderboards.`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[#060612]" />
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]" />
            <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/#games"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8"
            >
              <ChevronLeft className="h-4 w-4" />
              All Games
            </Link>

            <div className="flex items-start gap-5 mb-6">
              <div className="text-5xl sm:text-6xl">{game.icon}</div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {game.name}{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
                    Score Tracker
                  </span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${scoring.color}`}>
                    <ScoringIcon className="h-3.5 w-3.5" />
                    {scoring.label}
                  </span>
                  <span className="text-sm text-slate-400">
                    {categoryLabels[game.category]}
                  </span>
                  <span className="text-sm text-slate-500">
                    {playerRange} players
                  </span>
                  {game.config.targetScore && (
                    <span className="text-sm text-slate-500">
                      Target: {game.config.targetScore} pts
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
              Track your {game.name} scores effortlessly with Points Pad. Built-in {scoring.label.toLowerCase()} scoring
              for {playerRange} players with stats, leaderboards, and head-to-head rivalries.
              Free, offline, no sign-up required.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
              >
                <Gamepad2 className="h-4 w-4" />
                Start Scoring {game.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {game.amazonUrl && (
                <a
                  href={game.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Buy {game.name}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* How Scoring Works */}
        <section className="py-16 sm:py-20 border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              How to Score {game.name}
            </h2>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Scoring Type Explanation */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${scoring.color}`}>
                  <ScoringIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {scoring.label}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {scoring.description}
                </p>
                {game.config.targetScore && (
                  <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Default Target</div>
                    <div className="text-xl font-bold text-white mt-1">{game.config.targetScore} points</div>
                  </div>
                )}
                {game.config.lowestWins && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <div className="text-xs text-amber-400 font-medium">Lowest Score Wins</div>
                    <div className="text-sm text-slate-400 mt-1">In {game.name}, the player with the lowest score takes the victory.</div>
                  </div>
                )}
                {game.config.allowDraw && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <div className="text-xs text-blue-400 font-medium">Draws Allowed</div>
                    <div className="text-sm text-slate-400 mt-1">Games can end in a draw, which is factored into ELO calculations.</div>
                  </div>
                )}
              </div>

              {/* How to Use Points Pad */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border text-indigo-400 bg-indigo-400/10 border-indigo-400/20">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Scoring in Points Pad
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {scoring.howItWorks}
                </p>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">1</span>
                    <span className="text-sm text-slate-300">Open Points Pad and tap &quot;New Game&quot;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">2</span>
                    <span className="text-sm text-slate-300">Select {game.name} from the game list</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">3</span>
                    <span className="text-sm text-slate-300">Add {playerRange} players to the session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">4</span>
                    <span className="text-sm text-slate-300">Enter scores as you play — stats update automatically</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Tutorial */}
        {game.youtubeVideoId && (
          <section className="py-16 sm:py-20 border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                How to Play {game.name}
              </h2>
              <p className="text-slate-400 mb-8">
                New to {game.name}? Watch this tutorial to learn the rules before your next game night.
              </p>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.06] bg-slate-900">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${game.youtubeVideoId}`}
                  title={`How to Play ${game.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </section>
        )}

        {/* Stats Preview */}
        <section className="py-16 sm:py-20 border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Track Your {game.name} Stats
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl">
              Points Pad goes beyond simple score tracking. Get detailed analytics
              for every {game.name} session you play.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Win Rate', value: '68%', sub: 'Track your performance', icon: '📈' },
                { label: 'Games Played', value: '24', sub: 'Complete game history', icon: '🎲' },
                { label: 'Win Streak', value: '5', sub: 'Personal best tracking', icon: '🔥' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[
                '📊 Leaderboards across all players',
                '⚔️ Head-to-head matchup records',
                '📈 Win rate trends over time',
                '🏆 Longest winning streaks',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              {game.name} Scoring FAQ
            </h2>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-white font-medium text-sm hover:bg-white/[0.02] transition-colors list-none">
                    {faq.q}
                    <span className="ml-4 text-slate-500 group-open:rotate-45 transition-transform text-lg">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section className="py-16 sm:py-20 border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                More {categoryLabels[game.category]} Games
              </h2>
              <p className="text-slate-400 mb-8">
                Explore other {categoryLabels[game.category].toLowerCase()} games you can track with Points Pad.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedGames.map((g) => (
                  <Link
                    key={g.name}
                    href={`/game/${slugify(g.name)}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/[0.1] transition-colors"
                  >
                    <span className="text-xl flex-shrink-0">{g.icon}</span>
                    <span className="text-sm text-slate-300 truncate">{g.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="relative py-20 sm:py-28 overflow-hidden border-t border-white/[0.06]">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Track{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
                {game.name}?
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Free forever. No account needed. Start tracking {game.name} scores in seconds.
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-colors"
              >
                Start Scoring {game.name}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <AppStoreBadges />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}
