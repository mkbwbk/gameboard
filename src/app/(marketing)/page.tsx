import { MarketingNav } from '@/components/marketing/marketing-nav';
import { HeroSection } from '@/components/marketing/hero-section';
import { TrustBar } from '@/components/marketing/trust-bar';
import { FeaturesSection } from '@/components/marketing/features-section';
import { GameLibrarySection } from '@/components/marketing/game-library-section';
import { ScoringTypesSection } from '@/components/marketing/scoring-types-section';
import { StatsSection } from '@/components/marketing/stats-section';
import { PrivacySection } from '@/components/marketing/privacy-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { FinalCtaSection } from '@/components/marketing/final-cta-section';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Score Door',
  applicationCategory: 'GameApplication',
  operatingSystem: 'iOS, Android',
  description:
    'Board game score tracker with 45+ games, ELO ratings, leaderboards, and stats. 100% offline, no account needed.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingNav />
      <main>
        <HeroSection />
        <TrustBar />
        <FeaturesSection />
        <GameLibrarySection />
        <ScoringTypesSection />
        <StatsSection />
        <PrivacySection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <MarketingFooter />
    </>
  );
}
