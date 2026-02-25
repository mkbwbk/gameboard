export default function GameLoading() {
  return (
    <div className="min-h-screen bg-[#060612]">
      {/* Nav placeholder */}
      <div className="h-16" />

      {/* Hero skeleton */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <div className="h-5 w-24 bg-white/[0.05] rounded mb-8 animate-pulse" />

          <div className="flex items-start gap-5 mb-6">
            {/* Game icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/[0.05] rounded-xl animate-pulse" />
            <div className="flex-1">
              {/* Title */}
              <div className="h-10 sm:h-12 w-72 bg-white/[0.05] rounded-lg animate-pulse" />
              {/* Badges */}
              <div className="flex gap-3 mt-3">
                <div className="h-6 w-32 bg-white/[0.05] rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-white/[0.05] rounded animate-pulse" />
                <div className="h-6 w-20 bg-white/[0.05] rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 max-w-2xl">
            <div className="h-5 w-full bg-white/[0.05] rounded animate-pulse" />
            <div className="h-5 w-4/5 bg-white/[0.05] rounded animate-pulse" />
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex gap-4">
            <div className="h-12 w-48 bg-indigo-600/20 rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-white/[0.03] rounded-xl border border-white/5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Scoring section skeleton */}
      <section className="py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-white/[0.05] rounded-lg mb-8 animate-pulse" />
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 h-64 animate-pulse" />
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 h-64 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Video section skeleton */}
      <section className="py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 bg-white/[0.05] rounded-lg mb-2 animate-pulse" />
          <div className="h-5 w-80 bg-white/[0.05] rounded mb-8 animate-pulse" />
          <div className="aspect-video rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
        </div>
      </section>

      {/* FAQ skeleton */}
      <section className="py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-52 bg-white/[0.05] rounded-lg mb-8 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
