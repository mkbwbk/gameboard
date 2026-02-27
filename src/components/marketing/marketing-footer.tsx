import Link from 'next/link';
import Image from 'next/image';

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image src="/icons/icon-192.png" alt="Score Door" className="w-7 h-7 rounded-lg" width={28} height={28} />
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
