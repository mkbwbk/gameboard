import {
  Target,
  ListOrdered,
  Trophy,
  Hash,
  TrendingUp,
  Users,
} from 'lucide-react';

const scoringTypes = [
  {
    icon: Target,
    name: 'Race',
    description: 'First to the target score wins.',
    examples: 'Catan, Splendor, King of Tokyo',
    color: 'text-red-400 bg-red-400/10',
  },
  {
    icon: ListOrdered,
    name: 'Round-Based',
    description: 'Track scores round by round.',
    examples: 'Gin Rummy, Darts, Sushi Go',
    color: 'text-amber-400 bg-amber-400/10',
  },
  {
    icon: Trophy,
    name: 'Win / Loss',
    description: 'Simple winner and loser tracking.',
    examples: 'UNO, Codenames, Monopoly',
    color: 'text-green-400 bg-green-400/10',
  },
  {
    icon: Hash,
    name: 'Final Score',
    description: 'Compare final totals at the end.',
    examples: 'Wingspan, Scrabble, Azul',
    color: 'text-blue-400 bg-blue-400/10',
  },
  {
    icon: TrendingUp,
    name: 'ELO Rating',
    description: 'Competitive skill rating over time.',
    examples: 'Chess, Go, Checkers',
    color: 'text-violet-400 bg-violet-400/10',
  },
  {
    icon: Users,
    name: 'Cooperative',
    description: 'Win or lose as a team.',
    examples: 'Pandemic, The Mind, Hanabi',
    color: 'text-pink-400 bg-pink-400/10',
  },
];

export function ScoringTypesSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            One App, Six Ways to Score
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Every game scores differently. Score Door adapts to each one automatically.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scoringTypes.map((type) => (
            <div
              key={type.name}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${type.color}`}
              >
                <type.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                {type.name}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {type.description}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {type.examples}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
