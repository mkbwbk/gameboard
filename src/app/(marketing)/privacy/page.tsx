import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Points Pad',
  description: 'Privacy policy for the Points Pad board game score tracking app.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          &larr; Back to home
        </Link>

        <h1 className="mt-8 text-3xl sm:text-4xl font-bold text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="mt-10 space-y-8 text-slate-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              The Short Version
            </h2>
            <p>
              Points Pad stores all your data locally on your device. We don&apos;t
              collect, transmit, or store any personal information on our servers.
              We have no servers. Your data is yours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Data Storage
            </h2>
            <p>
              All game data, player information, scores, and settings are stored
              exclusively in your browser&apos;s IndexedDB storage on your device. This
              data never leaves your device unless you explicitly export it using
              the backup feature.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Data Collection
            </h2>
            <p>
              Points Pad does not collect any personal data. We do not use
              analytics, tracking pixels, cookies, or any form of user monitoring.
              We do not have access to your game data, player names, scores, or
              any other information you enter into the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Third-Party Services
            </h2>
            <p>
              The app includes optional links to YouTube (for game tutorials) and
              Amazon (for game purchases). These links open in your browser and
              are subject to those services&apos; own privacy policies. Points Pad does
              not share any data with these services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Data Backup & Export
            </h2>
            <p>
              You can export all your data at any time as a JSON file from the
              Settings page. This file is saved directly to your device. You can
              also import a previously exported backup to restore your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Data Deletion
            </h2>
            <p>
              Since all data is stored locally, you can delete it at any time by
              clearing your browser&apos;s data or uninstalling the app. We cannot
              delete your data because we don&apos;t have access to it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Children&apos;s Privacy
            </h2>
            <p>
              Points Pad is suitable for all ages. Since we do not collect any
              personal information, there are no special concerns regarding
              children&apos;s privacy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Changes to This Policy
            </h2>
            <p>
              If we make changes to this privacy policy, we will update the
              &quot;Last updated&quot; date above. Since Points Pad stores no user data
              on external servers, changes are unlikely.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
            <p>
              If you have questions about this privacy policy, please reach out
              via the app&apos;s support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
