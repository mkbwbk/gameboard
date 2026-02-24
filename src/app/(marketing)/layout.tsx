import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Points Pad — Free Board Game Score Tracker',
  description:
    'Track board game scores with 45+ games, ELO ratings, leaderboards, and stats. 100% offline, no account needed. Free for iOS, Android & web.',
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
    title: 'Points Pad — Free Board Game Score Tracker',
    description:
      'Track scores, stats, and rivalries across 45+ board games. Free, offline, no sign-up.',
    url: 'https://pointspad.com',
    siteName: 'Points Pad',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Points Pad — Board Game Score Tracker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Points Pad — Free Board Game Score Tracker',
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
    <div className="dark bg-[#060612] min-h-screen text-white">{children}</div>
  );
}
