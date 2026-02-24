import { Gamepad2, Target, BarChart3, WifiOff } from 'lucide-react';

const gameEmojis = ['🎲', '♟️', '⬛', '⚫', '🔴', '🔤', '🎯', '🧵', '🦅', '🚂', '🏝️', '🏰', '🪐', '🔷', '🏛️', '💎', '👑', '⚔️', '🦊', '🐻'];

function AnimatedBar({ name, pct, color, delay }: { name: string; pct: number; color: string; delay: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 text-slate-400 font-medium">{name}</span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full pp-animate-bar`}
          style={{ width: `${pct}%`, animationDelay: `${delay}ms` }}
        />
      </div>
      <span className="text-slate-400 w-9 text-right font-semibold">
        {pct}%
      </span>
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  return (
    <div
      className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 pp-animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${feature.iconColor}`}
      >
        <feature.icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-white">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
        {feature.description}
      </p>
      {feature.visual}
    </div>
  );
}

const features = [
  {
    icon: Gamepad2,
    title: '45+ Games Built In',
    description:
      'From Catan to Codenames, Wingspan to Poker. Every game pre-configured with the right scoring method.',
    iconColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    visual: (
      <div className="mt-4 flex flex-wrap gap-2">
        {gameEmojis.map((emoji, i) => (
          <span
            key={i}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-base hover:scale-110 transition-transform"
          >
            {emoji}
          </span>
        ))}
        <span className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-semibold">
          +25
        </span>
      </div>
    ),
  },
  {
    icon: Target,
    title: 'Smart Scoring',
    description:
      'Six scoring types that adapt to your game. Race to a target, track rounds, ELO ratings, and more.',
    iconColor: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    visual: (
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { type: 'Race', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
          { type: 'Rounds', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
          { type: 'Win/Loss', color: 'bg-green-500/15 text-green-400 border-green-500/20' },
          { type: 'Points', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
          { type: 'ELO', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
          { type: 'Co-op', color: 'bg-pink-500/15 text-pink-400 border-pink-500/20' },
        ].map((item) => (
          <span
            key={item.type}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${item.color}`}
          >
            {item.type}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: 'Stats That Settle Debates',
    description:
      'Leaderboards, win rates, head-to-head records, and streaks. Finally prove who really dominates.',
    iconColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    visual: (
      <div className="mt-4 space-y-2">
        <AnimatedBar name="Sarah" pct={72} color="from-indigo-500 to-violet-500" delay={0} />
        <AnimatedBar name="Mike" pct={65} color="from-violet-500 to-purple-500" delay={150} />
        <AnimatedBar name="Jake" pct={58} color="from-purple-500 to-pink-500" delay={300} />
      </div>
    ),
  },
  {
    icon: WifiOff,
    title: 'Works Offline, Always',
    description:
      'All data stays on your device. No accounts, no servers, no subscriptions. Just open and play.',
    iconColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    visual: (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'No Server', emoji: '🚫', sub: 'Zero backend' },
          { label: 'No Ads', emoji: '✨', sub: 'Ever' },
          { label: 'Your Data', emoji: '🔒', sub: 'Always private' },
        ].map((item) => (
          <div
            key={item.label}
            className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
          >
            <div className="text-xl mb-1">{item.emoji}</div>
            <div className="text-xs font-medium text-slate-300">
              {item.label}
            </div>
            <div className="text-[10px] text-slate-500">{item.sub}</div>
          </div>
        ))}
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 -z-10 hidden sm:block" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] -z-10 hidden sm:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything Your Game Night Needs
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Built for board gamers who are tired of scribbling scores on napkins.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
