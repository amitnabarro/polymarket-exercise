# Polymarket Clone

A frontend recreation of [Polymarket](https://polymarket.com) — prediction market browsing with live odds, category pages, and event detail views. Data comes from Polymarket's public Gamma and Data APIs; prices update in real time over WebSocket.

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| Language | TypeScript |
| UI | React 19, [Tailwind CSS 4](https://tailwindcss.com) |
| State | [Jotai](https://jotai.org) + [`jotai-family`](https://github.com/jotaijs/jotai-family) |
| Realtime | WebSocket client to Polymarket CLOB |
| APIs | Gamma API (events, tags, search), Data API (leaderboard) |
| Tooling | ESLint (`eslint-config-next`), PostCSS |

No API keys, database, or environment variables are required.

### Next.js & React

The app uses the **Next.js App Router** with a mix of server and client components:

- **Server components** fetch initial data in `app/*/page.tsx` (events by slug, politics/sports sub-tags, static revalidation where payloads are small enough).
- **Client components** (`"use client"`) handle interactivity: filters, search, live prices, and Jotai state.
- **`Suspense`** wraps async Jotai-driven sections (home grid, category pages) so the shell renders while data loads.
- **`React.memo`** on cards and `LivePrice` limits re-renders when unrelated market prices update.

### Jotai (state management)

[Jotai](https://jotai.org) provides atomic, bottom-up global state without a large central store. Atoms live in `lib/atoms/` and are grouped by concern:

| Module | Atoms | Purpose |
|---|---|---|
| `ui.ts` | `searchQueryAtom`, `categoryAtom`, `sortOrderAtom`, … | URL-synced UI: search text, category, sort order |
| `markets.ts` | `trendingEventsAtom`, `featuredEventsAtom`, `searchResultsAtom` | Async atoms that fetch and filter market lists |
| `category-pages.ts` | `politicsEventsAtom`, `sportsEventsAtom`, `cryptoLiveEventsAtom`, … | Per-page data + tag/asset filters |
| `prices.ts` | `livePriceAtomFamily`, `subscriptionRefCountsAtom`, `wsStatusAtom` | Real-time price state and WebSocket subscription tracking |
| `events-cache.ts` | `trendingEventsCacheAtom` | 60-second TTL write-through cache for trending events |

**Why Jotai here**

- **Fine-grained updates:** Each outcome token has its own atom via `livePriceAtomFamily` (from `jotai-family`). When one price changes, only components subscribed to that token re-render — not the whole page.
- **Async data:** Market lists use async atoms (`atom(async (get) => …)`) so components can `useAtomValue(trendingEventsAtom)` and Suspense handles loading.
- **Derived state:** e.g. `activeAssetIdsKeyAtom` derives a stable subscription key from ref-counts so the WebSocket layer only reconnects when the set of subscribed tokens actually changes.
- **No provider boilerplate:** A single `<Provider>` in `components/providers/jotai-provider.tsx` wraps the app; atoms are imported where needed.

**Live price flow**

1. A card or event page calls `useSubscribePrices(tokenIds)` — ref-counts each token in `subscriptionRefCountsAtom`.
2. `LivePriceProvider` watches `activeAssetIdsKeyAtom` and tells the singleton `MarketSocket` which assets to subscribe to.
3. Incoming WebSocket messages update `livePriceAtomFamily(assetId)` via `setLivePriceAtom`.
4. `LivePrice` reads the family atom for its token and flashes green/red on change.

### Tailwind CSS

Styling uses **[Tailwind CSS v4](https://tailwindcss.com)** with the PostCSS plugin (`@tailwindcss/postcss`). Configuration is CSS-first in `app/globals.css` rather than a `tailwind.config.js` file:

- **`@import "tailwindcss"`** — v4 entry point.
- **CSS variables** in `:root` define a dark Polymarket-like palette (`--background`, `--card`, `--primary`, etc.).
- **`@theme inline`** maps those variables to Tailwind utilities (`bg-background`, `text-muted-foreground`, `bg-yes`, `bg-no`, …).
- **Custom utilities** for scrollbar hiding (`.scrollbar-none`) and price flash animations (`.price-flash-up` / `.price-flash-down`).

Components use utility classes throughout — responsive grids (`sm:grid-cols-2`, `lg:grid-cols-3`), sticky sidebars (`sticky top-20`), pill filters, and card layouts. Yes/No buttons use semantic `text-yes` / `text-no` colors from the theme.

### Price model

Polymarket prices are **0–1 implied probabilities** (e.g. `0.65` = 65% chance). The UI treats them that way end-to-end:

- `lib/utils/price.ts` — `clampProbability()` and `toImpliedPercent()` normalize API/WS values before display.
- `lib/utils/format.ts` — `formatPercent`, `formatPercentPrecise`, and `formatCents` all derive from that 0–1 model.
- `ImpliedProbabilityBar` — bar width = `price × 100`.
- Multi-outcome cards show each outcome's **Yes** and **No** prices from the API (not `1 − yes`).

### Realtime WebSocket

`lib/ws/market-socket.ts` implements a singleton WebSocket client to Polymarket's CLOB subscription endpoint. It:

- Sends `PING` every 10 seconds to keep the connection alive.
- Subscribes/unsubscribes to asset IDs as the visible market set changes.
- Handles `best_bid_ask`, `price_change`, `last_trade_price`, and `book` message types.

Connection status is exposed via `wsStatusAtom` and shown in the header `LiveIndicator`.

### External APIs

| API | Base URL | Used for |
|---|---|---|
| Gamma | `https://gamma-api.polymarket.com` | Events, tags, related tags, public search |
| Data | `https://data-api.polymarket.com` | Leaderboard |
| CLOB WS | `wss://ws-subscriptions-clob.polymarket.com/ws/market` | Live outcome prices |

Politics and sports sidebar filters are driven by `GET /tags/slug/{category}/related-tags`; selecting a filter fetches events with `?tag_id=…`.

### Other tooling

- **TypeScript** — strict typing for API responses (`lib/types/polymarket.ts`), WebSocket messages, and component props.
- **ESLint** — `eslint-config-next` for Next.js + React rules (`npm run lint`).
- **Geist fonts** — loaded via `next/font/google` in `app/layout.tsx` for sans and mono text.
- **Next.js Image config** — `next.config.ts` allows remote images from Polymarket's S3 bucket.

## Prerequisites

- **Node.js** 20.x or later
- **npm** 10+ (or pnpm / yarn / bun)

## Install

```bash
git clone <repository-url>
cd exercise
npm install
```

## Development

Start the dev server with hot reload:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If port 3000 is already in use, Next.js will pick the next available port (check the terminal output).

## Production Build

Build an optimized production bundle:

```bash
npm run build
```

Run the production server locally:

```bash
npm start
```

The app listens on [http://localhost:3000](http://localhost:3000) by default.

## Lint

```bash
npm run lint
```

## Routes

| Path | Description |
|---|---|
| `/` | Trending / featured markets with sort and category filters |
| `/politics` | Politics markets with API-driven sidebar filters |
| `/sports` | Sports matchups and futures with league sidebar |
| `/crypto` | Live, threshold, and prediction crypto markets |
| `/search?q=…` | Full-text market search |
| `/leaderboard` | Top traders by volume and PnL |
| `/event/[slug]` | Event detail — outcomes, probability bars, live prices |

## Architecture Overview

```
app/                  Next.js pages (App Router)
components/           UI components and page clients
lib/
  api/gamma.ts        Gamma + Data API clients
  atoms/              Jotai atoms (markets, prices, UI, cache)
  hooks/              WebSocket subscription hooks
  types/              Polymarket + WebSocket TypeScript types
  utils/              Formatting, category matching, token helpers
  ws/market-socket.ts Singleton WebSocket manager
```

See **Technology Stack** above for details on Jotai atoms, Tailwind theming, and the live price pipeline.

**Caching:** Trending events are cached in Jotai with a 60-second TTL to reduce repeated large API payloads during client navigation.

Remote images from `polymarket-upload.s3.us-east-2.amazonaws.com` are allowed in `next.config.ts`.

## Known Limitations

- No authentication, trading, or wallet integration (read-only clone).
- Home trending fetch uses `no-store` because the full events payload can exceed 2 MB.
- WebSocket subscriptions are ref-counted client-side; very large event pages subscribe to many tokens at once.
