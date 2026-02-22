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

The full implementation plan is at: `~/.claude/plans/valiant-inventing-zebra.md`

### Execution Protocol

Each phase below is self-contained. After completing a phase:
1. Run exit gates (`npm run build`, `npm run lint`, manual verification)
2. Update the Launch Status table below to mark the phase COMPLETE
3. Commit the phase's changes with the specified commit message
4. Proceed to the next NOT STARTED phase **without waiting for user confirmation**

If a phase fails exit gates, fix the issue and re-run gates before proceeding.

### Phase Summary

| Phase | Description | Key Files |
|---|---|---|
| 1 | Model & DB — Add `GameCategory` enum, `isFavourite`, `category`, `youtubeVideoId`, `amazonUrl` to Game model. Bump Dexie to v2. | `src/lib/models/game.ts`, `src/lib/db/database.ts` |
| 2 | 50 Games — Expand `DEFAULT_GAMES` from 10→~50. Add affiliate tag, YouTube IDs, Amazon URLs. Rename Shithead→Palace. Update seed logic. | `src/lib/constants/games.ts`, `src/lib/db/seed.ts` |
| 3 | Favourites — `toggleFavourite()` hook, heart icon on GameCard, favourites section on games list and session picker. | `src/lib/hooks/use-games.ts`, `src/components/games/game-card.tsx`, `src/app/(main)/games/page.tsx`, `src/app/(main)/session/new/page.tsx` |
| 4 | Game Detail — YouTube embed, "Buy This Game" Amazon link, favourite toggle, category badge on game detail page. | `src/app/(main)/games/[gameId]/page.tsx` |
| 5 | Games List — Search bar, category filter chips, improved layout with favourites pinned at top. | `src/app/(main)/games/page.tsx` |
| 6 | Native App — Capacitor setup, static export, iOS/Android platform config, app store metadata prep. | `next.config.ts`, `capacitor.config.ts`, `package.json` |

### Launch Status

| Phase | Status |
|---|---|
| Phase 1: Model & DB | COMPLETE |
| Phase 2: 50 Games | COMPLETE |
| Phase 3: Favourites | COMPLETE |
| Phase 4: Game Detail | COMPLETE |
| Phase 5: Games List | COMPLETE |
| Phase 6: Native App | NOT STARTED |
