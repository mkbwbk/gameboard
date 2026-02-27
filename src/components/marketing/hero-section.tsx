import { AppStoreBadges } from './app-store-badges';
import { PhoneMockup } from './phone-mockup';

function AnimatedBar({ targetWidth, delay, color }: { targetWidth: number; delay: number; color: string }) {
  return (
    <div
      className={`h-full ${color} rounded-full pp-animate-bar`}
      style={{ width: `${targetWidth}%`, animationDelay: `${delay}ms` }}
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Rich background with warm gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#060612]" />
        {/* Simple gradient for mobile, full blur blobs for desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-transparent to-transparent sm:hidden" />
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[160px] hidden sm:block" />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-violet-700/15 rounded-full blur-[120px] hidden sm:block" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/8 rounded-full blur-[100px] hidden sm:block" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 pp-animate-fade-up" style={{ animationDelay: '100ms' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                45+ games ready to play
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] pp-animate-fade-up" style={{ animationDelay: '200ms' }}>
              Your Game Night,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
                Finally Tracked.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed pp-animate-fade-up" style={{ animationDelay: '400ms' }}>
              Score 45+ board games, settle rivalries with real stats, and never
              argue about who&apos;s winning again.{' '}
              <span className="text-white font-medium">
                Free. Offline. No sign-up.
              </span>
            </p>

            <div id="download" className="mt-10 pp-animate-fade-up" style={{ animationDelay: '600ms' }}>
              <AppStoreBadges />
            </div>
          </div>

          {/* Phone mockup column with animated game pieces */}
          <div className="relative flex justify-center lg:justify-end pp-animate-scale" style={{ animationDelay: '300ms' }}>
            {/* Animated floating info cards */}
            <FloatingCard className="absolute -top-4 left-0 sm:left-4 z-20" delay={0} enterDelay={800}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/50 shadow-xl backdrop-blur-sm">
                <span className="text-lg">🏆</span>
                <div>
                  <div className="text-[10px] text-slate-400">Winner!</div>
                  <div className="text-xs font-semibold text-amber-400">Sarah</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute top-16 right-0 sm:right-2 z-20" delay={1.5} enterDelay={1000}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/50 shadow-xl backdrop-blur-sm">
                <span className="text-lg">🔥</span>
                <div>
                  <div className="text-[10px] text-slate-400">Win Streak</div>
                  <div className="text-xs font-semibold text-orange-400">5 in a row</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute bottom-24 left-0 sm:left-0 z-20" delay={3} enterDelay={1200}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/50 shadow-xl backdrop-blur-sm">
                <span className="text-lg">⚔️</span>
                <div>
                  <div className="text-[10px] text-slate-400">Head to Head</div>
                  <div className="text-xs font-semibold text-indigo-400">Sarah 8 - 5 Mike</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute bottom-12 right-0 sm:right-0 z-20" delay={4.5} enterDelay={1400}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/50 shadow-xl backdrop-blur-sm">
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-[10px] text-slate-400">ELO Rating</div>
                  <div className="text-xs font-semibold text-green-400">1,342 (+28)</div>
                </div>
              </div>
            </FloatingCard>

            <PhoneMockup>
              <div className="p-3 pt-10 space-y-2.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <div className="text-white font-bold text-sm">Dashboard</div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[8px]">☀️</div>
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[8px]">⚙️</div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-gradient-to-br from-indigo-600/30 to-indigo-800/20 rounded-xl p-2 text-center border border-indigo-500/20">
                    <div className="text-indigo-300 font-bold text-base pp-animate-count" style={{ animationDelay: '400ms' }}>24</div>
                    <div className="text-indigo-400/60 text-[9px]">Games</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-600/30 to-emerald-800/20 rounded-xl p-2 text-center border border-emerald-500/20">
                    <div className="text-emerald-300 font-bold text-base pp-animate-count" style={{ animationDelay: '600ms' }}>68%</div>
                    <div className="text-emerald-400/60 text-[9px]">Win Rate</div>
                  </div>
                  <div className="bg-gradient-to-br from-violet-600/30 to-violet-800/20 rounded-xl p-2 text-center border border-violet-500/20">
                    <div className="text-violet-300 font-bold text-base pp-animate-count" style={{ animationDelay: '800ms' }}>5</div>
                    <div className="text-violet-400/60 text-[9px]">Players</div>
                  </div>
                </div>

                {/* Leaderboard with animated bars */}
                <div className="bg-slate-800/60 rounded-xl p-2.5 space-y-1.5 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-white font-semibold text-[11px]">Leaderboard</div>
                    <div className="text-[8px] text-indigo-400">View all</div>
                  </div>
                  {[
                    { name: 'Sarah', avatar: '😎', color: 'bg-amber-500', pct: 72, medal: '🥇' },
                    { name: 'Mike', avatar: '🎮', color: 'bg-slate-500', pct: 65, medal: '🥈' },
                    { name: 'Jake', avatar: '🧙', color: 'bg-emerald-600', pct: 58, medal: '🥉' },
                    { name: 'Emma', avatar: '🦊', color: 'bg-pink-600', pct: 51, medal: '' },
                  ].map((player, i) => (
                    <div key={player.name} className="flex items-center gap-2 p-1.5 rounded-lg">
                      <span className="text-[10px] w-4 text-center">{player.medal || `${i + 1}`}</span>
                      <div className={`w-5 h-5 rounded-full ${player.color} flex items-center justify-center text-[8px]`}>
                        {player.avatar}
                      </div>
                      <span className="flex-1 text-slate-200 text-[10px]">{player.name}</span>
                      <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <AnimatedBar targetWidth={player.pct} delay={800 + i * 200} color="bg-indigo-500" />
                      </div>
                      <span className="text-indigo-400 font-bold text-[10px] w-7 text-right">{player.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Recent games */}
                <div className="bg-slate-800/60 rounded-xl p-2.5 space-y-1.5 border border-slate-700/30">
                  <div className="text-white font-semibold text-[11px] mb-1">Recent Games</div>
                  {[
                    { icon: '🏝️', name: 'Catan', winner: 'Sarah', time: '2h ago' },
                    { icon: '🐦', name: 'Wingspan', winner: 'Mike', time: 'Yesterday' },
                    { icon: '🚂', name: 'Ticket to Ride', winner: 'Jake', time: '3 days ago' },
                  ].map((g) => (
                    <div key={g.name} className="flex items-center gap-2 p-1.5 rounded-lg">
                      <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-sm">{g.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-200 text-[10px] font-medium">{g.name}</div>
                        <div className="text-slate-500 text-[8px]">{g.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 text-[9px]">🏆</div>
                        <div className="text-[8px] text-slate-400">{g.winner}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom nav bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 border-t border-slate-700/30 px-2 py-2 flex justify-around">
                  {[
                    { icon: '📊', label: 'Stats', active: true },
                    { icon: '🎲', label: 'Games', active: false },
                    { icon: '📜', label: 'History', active: false },
                    { icon: '👥', label: 'Players', active: false },
                  ].map((tab) => (
                    <div key={tab.label} className="text-center">
                      <div className="text-sm">{tab.icon}</div>
                      <div className={`text-[7px] ${tab.active ? 'text-indigo-400' : 'text-slate-500'}`}>{tab.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  children,
  className,
  delay,
  enterDelay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
  enterDelay: number;
}) {
  return (
    <div
      className={`${className} pp-floating-card`}
      style={{
        animationDelay: `${enterDelay}ms, ${enterDelay + 500 + delay * 1000}ms`,
      }}
    >
      {children}
    </div>
  );
}
