import { AppStoreBadges } from './app-store-badges';
import { DEFAULT_GAMES } from '@/lib/constants/games';

const emojis = DEFAULT_GAMES.slice(0, 8).map((g) => g.icon);

export function FinalCtaSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Rich background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Decorative scattered game emojis */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {emojis.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-3xl sm:text-4xl opacity-[0.06]"
            style={{
              top: `${15 + (i * 11) % 70}%`,
              left: `${5 + (i * 14) % 90}%`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          Ready for Your Best{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
            Game Night?
          </span>
        </h2>
        <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
          Free forever. No account needed. Start tracking scores in seconds.
        </p>
        <div className="mt-10 flex justify-center">
          <AppStoreBadges />
        </div>
      </div>
    </section>
  );
}
