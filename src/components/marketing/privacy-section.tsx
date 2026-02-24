import { WifiOff, ShieldCheck, Download } from 'lucide-react';

const privacyPoints = [
  {
    icon: WifiOff,
    title: '100% Offline',
    description:
      'No internet required. Everything runs on your device. Perfect for game nights anywhere.',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: ShieldCheck,
    title: 'No Account Needed',
    description:
      'Open the app and start tracking. No email, no password, no sign-up forms.',
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  },
  {
    icon: Download,
    title: 'Full Data Control',
    description:
      'Export your data as a JSON backup anytime. Your scores, your device, your rules.',
    color: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  },
];

export function PrivacySection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Your Data. Your Device. Period.
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            No servers, no tracking, no sneaky data collection. Everything stays
            on your phone.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {privacyPoints.map((point) => (
            <div
              key={point.title}
              className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${point.color}`}
              >
                <point.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
