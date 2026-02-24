import { Gamepad2, Layers, DollarSign, UserX, WifiOff } from 'lucide-react';

const trustItems = [
  { icon: Gamepad2, label: '45+ Games', color: 'text-amber-400' },
  { icon: Layers, label: '6 Scoring Types', color: 'text-violet-400' },
  { icon: DollarSign, label: '100% Free', color: 'text-emerald-400' },
  { icon: UserX, label: 'No Account Needed', color: 'text-blue-400' },
  { icon: WifiOff, label: 'Works Offline', color: 'text-pink-400' },
];

export function TrustBar() {
  return (
    <section className="relative py-8 border-y border-white/[0.06] bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 text-slate-300"
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
