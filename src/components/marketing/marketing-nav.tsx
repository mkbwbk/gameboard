'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Games', href: '#games' },
  { label: 'Stats', href: '#stats' },
  { label: 'FAQ', href: '#faq' },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <svg className="w-8 h-8 rounded-lg" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="font-bold text-lg text-white">Score Door</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Download App
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#0a0a1a]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm text-slate-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#download"
              className="block text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-center transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Download App
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
