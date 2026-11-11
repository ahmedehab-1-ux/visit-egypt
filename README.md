# Visit Egypt

Egypt's tourism super-site. Every part of an Egyptian holiday is on one site: flights, hotels, Nile cruises, tours, airport transfers, car rental, eSIM, site tickets, restaurants, trains, insurance, fast-track, packages, an AI concierge, and visa and essentials. Travellers search, add items to one trip, and pay once.

> **Status: clickable prototype.** Every listing, price, rating and time slot is sample data. No real bookings or payments are made.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
```

Requires Node 18+.

## Project structure

```
index.html                 App shell: header, #app mount point, footer, modal and toast hosts
public/img/                Destination and experience photography (served as /img/*)
src/
  app.ts                   App logic: DOM helpers, state, cart/checkout, page renderers, map,
                           concierge NLU, event delegation (ACT), hash router
  catalog.ts               Pure data + i18n + formatting. Has no DOM access, so it is safe to import anywhere
  globals.d.ts             Ambient types (optional Claude runtime)
  styles/
    index.css              Imports the files below in cascade order. Keep that order
    base.css               Design tokens (:root), reset, buttons, chips, badges, header and mega-menu
    hero.css               Home hero + multi-service search console
    sections.css           Home bands: journey rail, packages, map, Nile, experiences, concierge
    listings-detail.css    Vertical headers, filters, result cards, flight rows, grids, comparisons
    booking.css            Empty/skeleton states, detail pages, booking box, checkout
    account.css            My trip, concierge, guide pages, overlays, footer
    responsive-overrides.css  Late fixes and responsive overrides
```

### How the app works

- **Routing:** hash-based (`#home`, `#hotels`, `#hotels-<id>`, `#dest-luxor`, `#visa`, `#trips`, `#checkout`, `#booking-<ref>`, `#concierge`). The router is `route()` at the bottom of `app.ts`.
- **Verticals:** each of the 13 services registers itself in the `VX` registry with `q0` (default query), `form`, `search`, `facets`, `sorts`, `card`, `detail`, `quote` and `conf`. The generic list, detail and booking renderers are driven from `VX`, so adding a service means adding one `VX` entry.
- **State:** one object, `S` (in `catalog.ts`). Language, currency, cart and bookings persist to `localStorage` under `visitegypt2`.
- **Events:** delegated. Any element with `data-act="name"` calls `ACT.name(el, event)`.
- **i18n:** EN, AR (RTL), DE, IT, ES, FR, RU, ZH. The strings are in `L` / `NL` in `catalog.ts` and are looked up with `t(key)`.
- **Concierge:** a rule-based intent parser (`localNLU`) builds and edits a day-by-day plan in which every item can be booked. If a Claude runtime is present, it handles questions the parser can't. Otherwise the built-in engine handles everything.

## Where this came from

This repo is a mechanical lift of the single-file HTML prototype into a Vite + TypeScript project. The extraction was checked for parity in a headless browser. All 19 routes rendered the same content as the original, and add-to-trip, checkout and the concierge planner behaved the same. No console errors appeared.

## Roadmap for the codebase

### 1. Typing plan
`tsconfig.json` is **strict** for all new code. The two legacy modules opt out with `// @ts-nocheck` on line 1. To type them:
1. Write interfaces for the catalog shapes (`Hotel`, `Cruise`, `Tour`, `Package`, `Destination`, `CartItem`, `Booking`, `AppState`) in `src/types.ts`.
2. Annotate `catalog.ts`, remove its `@ts-nocheck`, and fix the errors.
3. Do the same for `app.ts`. This is easiest after step 2 below.

### 2. Split `app.ts`
Suggested target:
```
src/state.ts        S, save/load, cart helpers
src/router.ts       route(), applyLang()
src/ui/             dom helpers ($, $$), modal, toast, forms, stepper, gallery, map SVG
src/verticals/      one file per service (flights.ts, hotels.ts, …), each exporting its VX entry
src/pages/          home, guide, destination, visa, trips, checkout, booking, concierge
src/concierge/      NLU, plan builder, chat UI
```
Move one area at a time and run `npm run build` plus a quick click-through after each move.

### 3. Replace sample data with real suppliers
Each vertical's `search()` / `get()` reads from the arrays in `catalog.ts`. Put each behind an async `src/api/<service>.ts` adapter so the UI doesn't care whether the data is sample or live. These are the planned integrations:

| Service | Planned source |
|---|---|
| Flights | GDS + airline NDC |
| Hotels | Hotel wholesalers (e.g. TBO) |
| Tours & activities | Activity marketplaces (e.g. GetYourGuide) + local operators |
| Transfers / cars | Transfer networks, car rental brokers |
| eSIM | eSIM wholesalers |
| Site tickets, eVisa | Phase 2 (official approvals pending) |

API keys and markups belong on a backend, never in this frontend bundle.

### 4. Production hygiene (later)
Optimise images (WebP/AVIF, responsive `srcset`; several are currently 0.5–1 MB). Add ESLint/Prettier, a CI build on every PR, and Playwright smoke tests for the core flows.
