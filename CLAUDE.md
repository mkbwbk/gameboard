# GameBoards

Board game score tracking PWA for tracking games played with friends.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui (new-york style), Lucide icons
- **Database:** Dexie (IndexedDB wrapper) — all data is client-side, no backend
- **Charts:** Recharts
- **IDs:** nanoid

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + typescript)

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (main)/               # Route group with bottom nav layout
      dashboard/          # Stats & charts
      games/              # Game CRUD & detail views
      players/            # Player list & profiles
      session/            # Score recording flow (new → active → complete)
      history/            # Past sessions
      settings/           # App settings
  components/
    ui/                   # shadcn/ui primitives
    scoring/              # Scoring UI per type (race, round, win-loss, elo, etc.)
    dashboard/            # Chart components
    players/              # Player avatar, card, form, picker
    games/                # Game card
    layout/               # Header, bottom nav, page container
    shared/               # Reusable components (empty-state)
    providers/            # DbProvider context
  lib/
    db/                   # Dexie database, seed data, backup/restore
    models/               # TypeScript interfaces (Player, Game, GameSession, ScoreData)
    hooks/                # Data hooks (use-players, use-games, use-session, use-scores, use-elo, use-theme)
    scoring/              # ELO calculation logic
    stats/                # Aggregation, leaderboard, head-to-head, player/game stats
    constants/            # Preset games, avatar options
    utils.ts              # cn() helper (clsx + tailwind-merge)
```

## Key Patterns

- **Client-only app.** No API routes, no server data fetching. All state lives in IndexedDB via Dexie. Use `useLiveQuery` from dexie-react-hooks for reactive data.
- **Path alias:** `@/*` maps to `./src/*`.
- **Scoring types:** Race, Round-based, Win/Loss, Final Score, ELO, Cooperative — each has its own scorer component in `components/scoring/` and a corresponding type in `lib/models/score.ts`.
- **Models use string IDs** generated with nanoid.
- **Components are client components** (`"use client"`) since data comes from IndexedDB.
- **PWA:** Service worker at `public/sw.js`, manifest in `src/app/manifest.ts`.

## Style Guide

- Use shadcn/ui components from `@/components/ui/` — add new ones via `npx shadcn@latest add <component>`.
- Tailwind classes with `cn()` utility for conditional merging.
- Dark theme: the app uses a slate/dark color scheme by default.

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

### Key Files Modified

| Area | Files |
|---|---|
| Models | `src/lib/models/game.ts`, `src/lib/db/database.ts` |
| Game Data | `src/lib/constants/games.ts`, `src/lib/db/seed.ts` |
| Favourites | `src/lib/hooks/use-games.ts`, `src/components/games/game-card.tsx` |
| Games UI | `src/app/(main)/games/page.tsx`, `src/app/(main)/games/[gameId]/page.tsx` |
| Session Picker | `src/app/(main)/session/new/page.tsx` |
| PWA | `src/app/manifest.ts`, `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-maskable.png` |

### Remaining Pre-Release Tasks

These tasks must be completed before the app is ready for app store submission. They can be done by Claude in a new session or manually by the developer.

#### 1. Verify & Fix YouTube Video IDs (CODE TASK)
The YouTube video IDs in `src/lib/constants/games.ts` are best-effort from training data. Many may be broken or link to the wrong video.
- **What to do:** For each game's `youtubeVideoId`, verify `https://www.youtube.com/watch?v={videoId}` loads a relevant "how to play" tutorial. Replace any broken/incorrect IDs.
- **File:** `src/lib/constants/games.ts` — each game entry has an optional `youtubeVideoId` field.
- **Tip:** Use browser tools or web search to find the correct video IDs. Search YouTube for `"how to play {game name}"` and grab the video ID from the URL.

#### 2. Verify & Fix Amazon ASINs (CODE TASK)
The Amazon product ASINs in `src/lib/constants/games.ts` are best-effort. Some may link to wrong products or dead listings.
- **What to do:** For each game's `amazonUrl`, verify the link loads the correct product on Amazon. Fix any broken ASINs.
- **File:** `src/lib/constants/games.ts` — the `amazonUrl(asin)` helper builds URLs like `https://www.amazon.com/dp/{ASIN}?tag=gameboard-20`.
- **Tip:** Search Amazon for the game name and grab the ASIN from the product URL (the 10-character alphanumeric code after `/dp/`).

#### 3. Update Amazon Affiliate Tag (CODE TASK)
The affiliate tag is currently a **placeholder**: `gameboard-20`.
- **What to do:** Replace with the real Amazon Associates tag.
- **File:** `src/lib/constants/games.ts`, line 3: `export const AFFILIATE_TAG = 'gameboard-20';`

#### 4. Deploy to Vercel (MANUAL)
The branch is ahead of origin. Push to deploy:
```bash
git push
```

#### 5. Generate 1024px App Icon (CODE TASK)
Apple App Store requires a 1024×1024 PNG icon with **no transparency** (no alpha channel). Currently only 192px and 512px icons exist.
- **What to do:** Generate `public/icons/icon-1024.png` from the SVG source. Ensure it has no alpha channel (use a white or dark background fill).
- **Source SVG:** `public/icons/icon.svg`
- **Tool:** `npx sharp-cli -i public/icons/icon.svg -o public/icons/icon-1024.png resize 1024 1024` (then flatten alpha with `--flatten` or add background)

#### 6. Review Service Worker Caching (CODE TASK)
The service worker at `public/sw.js` uses network-first with cache fallback. Before release:
- **Bump `CACHE_NAME`** from `'gameboard-v1'` to `'gameboard-v2'` to invalidate old caches after the launch changes.
- **Verify cached routes** — The install cache lists `/`, `/dashboard`, `/games`, `/players`, `/history`, `/session/new`. Ensure these still match the app's routes.
- The network-first strategy is fine for a PWABuilder-wrapped app since it will always try the live Vercel URL first.

#### 7. PWABuilder App Store Submission (MANUAL)
1. Go to [pwabuilder.com](https://www.pwabuilder.com)
2. Enter the deployed Vercel URL
3. Generate iOS and Android packages
4. **Test before submitting:** iOS via TestFlight, Android via Google Play internal testing track
5. Submit to Apple App Store and Google Play Store

#### 8. App Store Prerequisites (MANUAL)
- **Apple Developer account** — $99/year at [developer.apple.com](https://developer.apple.com)
- **Google Play Console** — $25 one-time at [play.google.com/console](https://play.google.com/console)
- **Privacy policy URL** — Required by both stores. Create and host a privacy policy page (can be a simple page on the Vercel domain, e.g. `/privacy`).
- **App pricing** — Decide on free vs paid and price point.
- **Screenshots** — Capture screenshots for store listings (iPhone 6.7", iPad 12.9", Android phone). Aim for 4–6 screens showing: games list, game detail with YouTube, active scoring session, dashboard/stats.
- **App metadata** — Name: "GameBoard - Score Tracker", Category: Games > Board Games, Age: 4+
- **App description** — Write a compelling store description (short + long versions).

#### 9. Apple App Review Compliance (IMPORTANT)
Apple may reject PWA wrappers under **Guideline 4.2** ("Minimum Functionality") if the app feels like "just a website." To reduce rejection risk:
- The app stores all data locally (IndexedDB) — this is genuine native-like functionality.
- Offline support via service worker is a strong signal.
- Consider adding a brief splash/onboarding screen on first launch to feel more app-like.
- If rejected, the appeal should emphasize: offline-first architecture, local data storage, no server dependency.

#### 10. Pre-Existing Lint Warnings (OPTIONAL)
There are 7 pre-existing ESLint errors and 13 warnings (setState in effects, unused vars, unescaped entities). These are not from the launch work but should be cleaned up before release.
- Run `npm run lint` to see the full list.
- These do **not** block the build.
