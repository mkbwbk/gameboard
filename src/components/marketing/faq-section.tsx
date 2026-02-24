'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Is Points Pad really free?',
    a: 'Yes, completely free. No ads, no in-app purchases, no subscriptions. All features are available from day one.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Points Pad works instantly with zero sign-up. Open the app and start tracking scores right away.',
  },
  {
    q: 'What if I lose my phone?',
    a: 'You can backup all your data as a JSON file at any time from the Settings page. We recommend backing up regularly.',
  },
  {
    q: 'Can I add my own games?',
    a: 'Absolutely. Create custom games with any of the six scoring types, set player limits, and choose a custom emoji icon.',
  },
  {
    q: 'Does it work without internet?',
    a: 'Yes. All data is stored locally on your device. The app works completely offline — no Wi-Fi or data needed.',
  },
  {
    q: 'What platforms is it available on?',
    a: 'Points Pad is available on the web (any browser), iOS (App Store), and Android (Google Play). Your data stays on whichever device you use.',
  },
  {
    q: 'How is this different from just using a notepad?',
    a: 'Points Pad automatically tracks stats over time: win rates, leaderboards, head-to-head records, ELO ratings, and streaks. A notepad can\u2019t tell you who\u2019s really winning across 50 game nights.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white/[0.01]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-white pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-slate-500 flex-shrink-0 transition-transform duration-200',
                    openIndex === i && 'rotate-180'
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
