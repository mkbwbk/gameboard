export function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      {/* Phone frame — modern iPhone style */}
      <div className="relative rounded-[2.5rem] border-[6px] border-slate-600/60 bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-500/20">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-full z-10" />

        {/* Screen content */}
        <div className="relative aspect-[9/19.5] bg-[#0f172a] overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-slate-500/40 rounded-full z-10" />
      </div>

      {/* Glow effects behind phone */}
      <div className="absolute -inset-8 -z-10 blur-3xl opacity-25 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 rounded-full" />
      <div className="absolute -inset-4 -z-10 blur-2xl opacity-15 bg-indigo-500 rounded-full" />
    </div>
  );
}
