import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg className="w-7 h-7 rounded-lg" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" rx="108" fill="#0f172a"/>
              <rect x="128" y="96" width="220" height="320" rx="6" fill="#1e293b"/>
              <circle cx="196" cy="168" r="20" fill="#8b5cf6"/>
              <circle cx="196" cy="232" r="20" fill="#ec4899"/>
              <circle cx="196" cy="296" r="20" fill="#f97316"/>
              <circle cx="196" cy="360" r="20" fill="#22c55e"/>
              <path d="M348 96 L348 416 L220 396 L220 116 Z" fill="#e2e8f0"/>
              <path d="M330 132 L330 238 L238 230 L238 142 Z" fill="#cbd5e1" opacity="0.6"/>
              <path d="M330 268 L330 374 L238 366 L238 278 Z" fill="#cbd5e1" opacity="0.6"/>
              <circle cx="250" cy="260" r="10" fill="#ffffff"/>
            </svg>
            <span className="font-semibold text-white">Score Door</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="#download"
              className="hover:text-slate-300 transition-colors"
            >
              Download App
            </a>
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-600">
            Made for game nights everywhere.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Score Door. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
