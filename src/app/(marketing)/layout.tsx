import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Score Door — Board Game Score Tracker for iOS & Android',
  description:
    'Track board game scores with 45+ games, ELO ratings, leaderboards, and stats. 100% offline, no account needed. Free for iOS & Android.',
  keywords: [
    'board game score tracker',
    'scorekeeper',
    'game score',
    'score card',
    'board game stats',
    'game night tracker',
    'score counter',
    'board game companion',
  ],
  openGraph: {
    title: 'Score Door — Board Game Score Tracker for iOS & Android',
    description:
      'Track scores, stats, and rivalries across 45+ board games. Free, offline, no sign-up.',
    url: 'https://scoredoor.app',
    siteName: 'Score Door',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Score Door — Board Game Score Tracker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Score Door — Board Game Score Tracker for iOS & Android',
    description:
      'Track scores, stats, and rivalries across 45+ board games. Free, offline, no sign-up.',
    images: ['/og-image.png'],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-[#060612] min-h-screen text-white overflow-x-hidden">{children}</div>
  );
}
