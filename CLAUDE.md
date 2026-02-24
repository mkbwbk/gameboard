# Points Pad

Board game score tracking PWA for tracking games played with friends. Rebranded from "GameBoard" to **Points Pad**.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui (new-york style), Lucide icons
- **Database:** Dexie (IndexedDB wrapper) — all data is client-side, no backend
- **Charts:** Recharts
- **IDs:** nanoid

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + typescript)

## Project Structure

```
src/
  app/
    (marketing)/              # Marketing/sales site (landing page, game pages, privacy)
      page.tsx                # Landing page at /
      layout.tsx              # Dark themed, full-width, SEO metadata
      privacy/page.tsx        # Privacy policy
      game/[slug]/page.tsx    # Individual game landing pages (45 pages, SSG)
    (main)/                   # Route group with bottom nav layout (the actual app)
      dashboard/              # Stats & charts
      games/                  # Game CRUD & detail views
      players/                # Player list & profiles
      session/                # Score recording flow (new → active → complete)
      history/                # Past sessions
      settings/               # App settings
    layout.tsx                # Root layout (metadataBase: pointspad.com)
    manifest.ts               # PWA manifest (Points Pad)
    sitemap.ts                # Sitemap with all game pages
  components/
    marketing/                # Marketing site components
      hero-section.tsx        # Animated hero with phone mockup, floating cards, count-up numbers
      features-section.tsx    # 4 feature cards with scroll-triggered animations
      game-library-section.tsx # Clickable grid of 45 games (links to /game/[slug])
      scoring-types-section.tsx
      stats-section.tsx
      privacy-section.tsx
      faq-section.tsx
      final-cta-section.tsx
      marketing-nav.tsx       # Sticky nav with anchor links
      marketing-footer.tsx
      phone-mockup.tsx        # iPhone frame component
      app-store-badges.tsx    # App Store + Google Play badges
      animate-on-scroll.tsx   # IntersectionObserver animation wrapper
    ui/                       # shadcn/ui primitives
    scoring/                  # Scoring UI per type (race, round, win-loss, elo, etc.)
    dashboard/                # Chart components
    players/                  # Player avatar, card, form, picker
    games/                    # Game card
    layout/                   # Header, bottom nav, page container
    shared/                   # Reusable components (empty-state)
    providers/                # DbProvider context
  lib/
    db/                       # Dexie database, seed data, backup/restore
    models/                   # TypeScript interfaces (Player, Game, GameSession, ScoreData)
    hooks/                    # Data hooks (use-players, use-games, use-session, use-scores, use-elo, use-theme)
    scoring/                  # ELO calculation logic
    stats/                    # Aggregation, leaderboard, head-to-head, player/game stats
    constants/                # Preset games (45), avatar options, slugify(), findGameBySlug()
    utils.ts                  # cn() helper (clsx + tailwind-merge)
```

## Key Patterns

- **Two route groups:** `(marketing)` for the public sales site (no DB, full-width, dark theme). `(main)` for the actual app (Header, BottomNav, DBProvider, max-w-lg).
- **Client-only app.** No API routes, no server data fetching. All state lives in IndexedDB via Dexie. Use `useLiveQuery` from dexie-react-hooks for reactive data.
- **Path alias:** `@/*` maps to `./src/*`.
- **Scoring types:** Race, Round-based, Win/Loss, Final Score, ELO, Cooperative — each has its own scorer component in `components/scoring/` and a corresponding type in `lib/models/score.ts`.
- **Models use string IDs** generated with nanoid.
- **Components are client components** (`"use client"`) since data comes from IndexedDB.
- **PWA:** Service worker at `public/sw.js` (cache name: `pointspad-v2`), manifest in `src/app/manifest.ts`. `start_url: '/dashboard'` so installed PWA bypasses marketing site.
- **Game slugs:** `slugify()` and `findGameBySlug()` in `lib/constants/games.ts`. URL pattern: `/game/{slug}` (e.g., `/game/catan`, `/game/wingspan`).
- **CSS animations:** Marketing animations defined in `globals.css` with `pp-` prefix (pp-float, pp-fade-in-up, pp-scale-in, etc.). No framer-motion — pure CSS + IntersectionObserver.

## Style Guide

- Use shadcn/ui components from `@/components/ui/` — add new ones via `npx shadcn@latest add <component>`.
- Tailwind classes with `cn()` utility for conditional merging.
- Dark theme: the app uses a slate/dark color scheme by default.
- Marketing site background: `#060612`.

---

## Marketing Site (COMPLETE)

Full marketing/sales landing page built at `/` with 45 individual game landing pages.

### What Was Built

| Feature | Description | Status |
|---|---|---|
| Landing Page | Hero with animated phone mockup, floating info cards, count-up numbers. Trust bar, features, games grid, scoring types, stats preview, privacy, FAQ, CTA. | ✅ COMPLETE |
| Game Landing Pages | 45 individual SEO-optimized pages at `/game/[slug]` with scoring explanation, YouTube embed, Amazon link, stats preview, FAQ, related games, CTAs. Static generation via `generateStaticParams`. | ✅ COMPLETE |
| SEO | JSON-LD (SoftwareApplication + FAQPage), Open Graph, per-page meta, sitemap with all game URLs, robots.txt. | ✅ COMPLETE |
| Privacy Policy | Full privacy policy at `/privacy`. | ✅ COMPLETE |
| Animations | Hero: count-up numbers, growing bars, staggered floating cards. Features: scroll-triggered card fade-in + bar growth. CSS-only with IntersectionObserver. | ✅ COMPLETE |
| Rebrand | Renamed from GameBoard → Points Pad across manifest, sw.js, header, layout, metadata. | ✅ COMPLETE |
| App Store Badges | Apple App Store + Google Play placeholder badges with correct logos. | ✅ COMPLETE |

### Key Marketing Files

| Area | Files |
|---|---|
| Landing Page | `src/app/(marketing)/page.tsx`, `src/app/(marketing)/layout.tsx` |
| Game Pages | `src/app/(marketing)/game/[slug]/page.tsx` |
| Hero | `src/components/marketing/hero-section.tsx` |
| Games Grid | `src/components/marketing/game-library-section.tsx` |
| Game Data | `src/lib/constants/games.ts` (slugify, findGameBySlug, DEFAULT_GAMES) |
| SEO | `src/app/sitemap.ts`, `public/robots.txt`, JSON-LD in page components |
| Animations | `src/app/globals.css` (pp-* keyframes), `src/components/marketing/animate-on-scroll.tsx` |
| Privacy | `src/app/(marketing)/privacy/page.tsx` |

---

## App Store Launch Plan

All 6 development phases are **COMPLETE**. The full implementation history is at: `~/.claude/plans/valiant-inventing-zebra.md`

### What Was Built (Phases 1–6, all COMPLETE)

| Phase | Description | Status |
|---|---|---|
| 1 | Model & DB — Added `GameCategory` enum, `isFavourite`, `category`, `youtubeVideoId`, `amazonUrl` to Game model. Dexie schema v2. | ✅ COMPLETE |
| 2 | 45 Games — Expanded from 10→45 preset games across 6 categories with YouTube IDs and Amazon URLs. Renamed Shithead→Palace. | ✅ COMPLETE |
| 3 | Favourites — Heart toggle on GameCard, favourites pinned at top of games list and session picker. | ✅ COMPLETE |
| 4 | Game Detail — YouTube embed, "Buy This Game" Amazon link, favourite toggle, category badge. | ✅ COMPLETE |
| 5 | Games List — Search bar, category filter chips, favourites section at top. | ✅ COMPLETE |
| 6 | Native App — PWA manifest updated, PNG icons generated (192/512/maskable). PWABuilder approach chosen. | ✅ COMPLETE |

### Key App Files

| Area | Files |
|---|---|
| Models | `src/lib/models/game.ts`, `src/lib/db/database.ts` |
| Game Data | `src/lib/constants/games.ts`, `src/lib/db/seed.ts` |
| Favourites | `src/lib/hooks/use-games.ts`, `src/components/games/game-card.tsx` |
| Games UI | `src/app/(main)/games/page.tsx`, `src/app/(main)/games/[gameId]/page.tsx` |
| Session Picker | `src/app/(main)/session/new/page.tsx` |
| PWA | `src/app/manifest.ts`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-maskable.png` |

---

## Marketing Site Improvements (COMPLETE)

Improvements made to the marketing/sales site for SEO and UX.

| Improvement | Description | Status |
|---|---|---|
| Game-Specific Scoring FAQs | Replaced generic FAQs on all 45 `/game/[slug]` pages with scoring-type-specific Q&A content. 5 FAQs per scoring type + custom overrides for 7 high-traffic games (Catan, Monopoly, Scrabble, Chess, Wingspan, Ticket to Ride, Darts). SEO-targeted for queries like "how to score in Catan". JSON-LD FAQPage schema unchanged. | ✅ COMPLETE |
| Interactive Category Filters | Homepage games grid category chips now clickable — filters the 45-game grid by category with game count. Converted `GameLibrarySection` to client component. | ✅ COMPLETE |
| SEO Cleanup | Removed `/dashboard` from sitemap (private app route). Added `Disallow` rules in `robots.txt` for all app routes (`/dashboard`, `/games`, `/players`, `/history`, `/session`, `/settings`). | ✅ COMPLETE |
| PWA Isolation | Changed `start_url` from `/` to `/dashboard` in manifest so installed PWA opens to app, not marketing site. Updated SW to v2: removed `/` from pre-cache, offline fallback to `/dashboard`. | ✅ COMPLETE |
| Seed Deduplication | Fixed React StrictMode double-seed bug that created duplicate games in dev. Module-level promise guard in `seed.ts`. | ✅ COMPLETE |
| Rebrand Cleanup | Changed "Loading GameBoard..." → "Loading Points Pad..." in `db-provider.tsx`. | ✅ COMPLETE |

### Key Files Changed

| Area | Files |
|---|---|
| Scoring FAQs | `src/lib/constants/game-faqs.ts` (NEW), `src/app/(marketing)/game/[slug]/page.tsx` |
| Category Filters | `src/components/marketing/game-library-section.tsx` |
| SEO | `src/app/sitemap.ts`, `public/robots.txt` |
| PWA | `src/app/manifest.ts`, `public/sw.js` |
| Seed Fix | `src/lib/db/seed.ts` |
| Rebrand | `src/components/providers/db-provider.tsx` |

---

## Remaining Pre-Release Tasks

### Code Tasks

1. **Verify & Fix YouTube Video IDs** — IDs in `src/lib/constants/games.ts` are best-effort. Verify each `youtubeVideoId` loads a relevant tutorial. Search YouTube for "how to play {game name}" to find correct IDs.

2. **Verify & Fix Amazon ASINs** — ASINs in `src/lib/constants/games.ts` are best-effort. Verify each `amazonUrl` loads the correct product. The `amazonUrl(asin)` helper builds `https://www.amazon.com/dp/{ASIN}?tag=gameboard-20`.

3. **Update Amazon Affiliate Tag** — Currently placeholder `gameboard-20` in `src/lib/constants/games.ts` line 3. Replace with real Amazon Associates tag.

4. **Generate 1024px App Icon** — Apple requires 1024×1024 PNG with no transparency. Source: `public/icons/icon.svg`. Use sharp-cli to generate.

5. ~~**Review Service Worker**~~ — ✅ DONE. SW updated to v2, pre-caches only app routes, offline fallback to `/dashboard`.

6. **Fix Pre-Existing Lint Warnings** — Run `npm run lint`. There are pre-existing warnings (setState in effects, unused vars, unescaped entities). Not blocking but should be cleaned up.

---

## App Store Launch Guide

### Architecture: How Marketing Site and PWA Coexist

The marketing site and app are in the **same Next.js project** using route groups:
- `(marketing)` → `/` (landing page), `/game/[slug]` (45 game pages), `/privacy`
- `(main)` → `/dashboard`, `/games`, `/players`, `/history`, `/session/*`, `/settings`

**Why this works for a PWA:**
- `manifest.ts` sets `start_url: '/dashboard'` — installed PWA opens directly to the app
- `display: 'standalone'` — no browser chrome, no URL bar, users can't navigate to marketing pages
- Bottom nav only links to app routes — no path from the app UI to the marketing site
- Service worker (v2) caches only app routes and falls back to `/dashboard` offline
- `robots.txt` blocks crawlers from app routes; `sitemap.ts` only includes marketing pages

**Web visitors** see the marketing site at `pointspad.com`. **PWA/app store users** see the app at `/dashboard`. Same domain, same deployment, completely separate experiences.

### Deployment: How to Ship to Vercel

1. Push to git → Vercel auto-deploys from the connected repo
2. Verify at `https://pointspad.com`:
   - `/` shows marketing landing page
   - `/game/catan` shows game-specific page with scoring FAQs
   - `/dashboard` shows the app (after IndexedDB seeds)
   - `/manifest.webmanifest` shows `start_url: "/dashboard"`
3. Test PWA install: Chrome > three-dot menu > "Install Points Pad" → should open to dashboard

### App Store Submission: Step-by-Step

#### Prerequisites

| Requirement | Status | Notes |
|---|---|---|
| Apple Developer account ($99/yr) | ❌ Needed | [developer.apple.com/programs](https://developer.apple.com/programs/) |
| Google Play Console ($25 one-time) | ❌ Needed | [play.google.com/console](https://play.google.com/console/) |
| Privacy policy URL | ✅ Ready | `https://pointspad.com/privacy` |
| 1024×1024 app icon (no transparency) | ❌ Needed | Generate from `public/icons/icon.svg` with sharp-cli |
| App screenshots (iPhone + Android) | ❌ Needed | 6.7" iPhone (1290×2796), 5.5" iPhone (1242×2208), Android phone (1080×1920) |
| App description & metadata | ✅ Draft | Name: "Points Pad - Score Tracker" |

#### Step 1: Deploy to Vercel
```bash
git push origin main
```
Verify the live site works at `pointspad.com`. Test the PWA install from Chrome.

#### Step 2: Generate App Packages with PWABuilder

1. Go to [pwabuilder.com](https://www.pwabuilder.com/)
2. Enter `https://pointspad.com`
3. PWABuilder will read the manifest and validate the PWA
4. Click **"Package for stores"**
5. Download:
   - **iOS** → Xcode project (`.xcodeproj`)
   - **Android** → Signed APK/AAB (`.aab`)

#### Step 3: iOS App Store (via TestFlight first)

1. Open the PWABuilder-generated Xcode project
2. Set the **Bundle Identifier** (e.g., `com.pointspad.app`)
3. Set the **Team** to your Apple Developer account
4. Update **Info.plist** with app name, version (1.0.0), and description
5. Archive the build: **Product → Archive** in Xcode
6. Upload to App Store Connect via **Distribute App → App Store Connect**
7. In [App Store Connect](https://appstoreconnect.apple.com/):
   - Create new app: "Points Pad - Score Tracker"
   - Category: Games > Board
   - Age rating: 4+ (no objectionable content)
   - Privacy policy URL: `https://pointspad.com/privacy`
   - Upload screenshots (6.7" and 5.5" required)
   - Add keywords: `board game score tracker, scorekeeper, game night, score counter`
   - Submit TestFlight build for **internal testing** first
8. After testing, submit for **App Review**

**Apple Guideline 4.2 (Minimum Functionality) considerations:**
- App stores data locally + works offline ✅
- Has unique features (45 games, ELO, stats, leaderboards) ✅
- Not just a website wrapper — has IndexedDB storage, offline capability, native-feel UI ✅
- Consider adding an onboarding flow for first launch to demonstrate value

#### Step 4: Google Play Store

1. Sign in to [Google Play Console](https://play.google.com/console/)
2. Create new app: "Points Pad - Score Tracker"
3. Upload the PWABuilder-generated AAB file
4. Fill in store listing:
   - Short description (80 chars): "Track board game scores with 45+ games, stats & leaderboards"
   - Full description: Expand on features, offline capability, free with no ads
   - Category: Game > Board
   - Content rating: Everyone
   - Privacy policy: `https://pointspad.com/privacy`
5. Upload screenshots (phone + 7" tablet recommended)
6. Create an **internal testing** track first
7. After testing, promote to **production**

#### Step 5: Post-Launch

- Monitor crash reports in App Store Connect / Play Console
- Respond to user reviews
- Update app by pushing to git (Vercel redeploys → PWA updates automatically)
- App store packages only need rebuilding for native changes (icon, splash screen, etc.)
- For content/feature updates, just push to git — the PWA inside the wrapper fetches from your Vercel URL
