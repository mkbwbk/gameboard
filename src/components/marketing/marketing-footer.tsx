import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs">
              🎯
            </div>
            <span className="font-semibold text-white">Points Pad</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-slate-300 transition-colors"
            >
              Open App
            </Link>
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-600">
            Made for game nights everywhere.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Points Pad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
