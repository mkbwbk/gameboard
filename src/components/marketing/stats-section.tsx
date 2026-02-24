import {
  Trophy,
  BarChart3,
  TrendingUp,
  Swords,
  CalendarDays,
  Flame,
} from 'lucide-react';

const statFeatures = [
  { icon: Trophy, label: 'Leaderboards' },
  { icon: BarChart3, label: 'Win/Loss Charts' },
  { icon: TrendingUp, label: 'Win Rate Over Time' },
  { icon: Swords, label: 'Head-to-Head Records' },
  { icon: CalendarDays, label: 'Activity Tracking' },
  { icon: Flame, label: 'Win Streaks' },
];

export function StatsSection() {
  return (
    <section id="stats" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[140px] -z-10 hidden sm:block" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] -z-10 hidden sm:block" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Stats mockup */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4 max-w-md mx-auto">
              {/* Mini leaderboard */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Leaderboard
                </div>
                {[
                  { name: 'Sarah', wins: 18, rate: 72, medal: '🥇' },
                  { name: 'Mike', wins: 15, rate: 65, medal: '🥈' },
                  { name: 'Jake', wins: 12, rate: 58, medal: '🥉' },
                  { name: 'Emma', wins: 10, rate: 51, medal: '' },
                ].map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]"
                  >
                    <span className="text-sm w-5 text-slate-500">
                      {p.medal || `${i + 1}`}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs">
                      {p.name[0]}
                    </span>
                    <span className="flex-1 text-sm text-white">{p.name}</span>
                    <span className="text-xs text-slate-500">{p.wins}W</span>
                    <span className="text-sm font-semibold text-indigo-400">
                      {p.rate}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Mini chart */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Win Rate Over Time
                </div>
                <div className="h-24 flex items-end gap-1.5 px-2">
                  {[45, 52, 48, 55, 60, 58, 65, 62, 68, 72, 70, 72].map(
                    (v, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t opacity-60 hover:opacity-100 transition-opacity"
                        style={{ height: `${v}%` }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Head-to-head */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-sm mx-auto">
                    S
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Sarah</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">8 - 5</div>
                  <div className="text-[10px] text-slate-500">Head to Head</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-violet-600/30 flex items-center justify-center text-sm mx-auto">
                    M
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Mike</div>
                </div>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 -z-10 blur-3xl opacity-15 bg-gradient-to-br from-indigo-600 to-violet-600 scale-105" />
          </div>

          {/* Text column */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Stats That Tell the Story
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-lg">
              Beautiful charts and analytics that prove who really owns game
              night. Track everything from win streaks to head-to-head rivalries.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {statFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <f.icon className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
