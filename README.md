A retro Pokédex for the first 649 Pokémon, built with Next.js, React,
TypeScript, Apollo GraphQL, Tailwind CSS, and React Aria.

## Getting Started

Use Node.js 22.6 or newer and pnpm 10.26.1, the version pinned in
`package.json`. Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The overview page is `src/app/page.tsx`. The page auto-updates as you edit it.

The shared layout in `src/app/layout.tsx` loads Pixelify Sans with
`next/font/google`.

## Project checks

- `pnpm lint` runs ESLint and Biome's import-order check.
- `pnpm typecheck` generates Next.js route types and runs TypeScript.
- `pnpm format:check` checks formatting with Prettier.
- `pnpm test` runs the six focused tests described below.

Prettier respects `.gitignore` and `.prettierignore`. The generated
`pnpm-lock.yaml` is excluded because pnpm maintains its formatting.

## Import ordering

Biome's [import organizer](https://biomejs.dev/assist/actions/organize-imports/)
keeps imports consistent across JavaScript and TypeScript files, including tests
and configuration files. It respects `.gitignore`; its formatter, linter, and
other assist actions are disabled. ESLint and Prettier retain their existing roles.

- `pnpm imports:check` checks import ordering without changing files.
- `pnpm imports:fix` applies Biome's import ordering.
- `pnpm lint` runs ESLint followed by the import-order check.

## Pokémon data caching

Successful normalized overview and detail results use Next.js's persistent Data
Cache, with a 24-hour revalidation interval. Detail IDs have separate cache
entries; changing a GraphQL query also changes its cache key.

The overview loads up to 36 Pokémon per batch, up to National Pokédex #649.
Each batch has its own cache entry, keyed by the normalized filters and the last
species ID from the previous batch. Filters apply before pagination. In the
unfiltered catalog, the final batch contains only #649. An
aggregate count in the same GraphQL request supplies the catalog total. Reading
the whole catalog takes 19 overview queries on a cold cache; shared warm batches
are reused across visitors. Overview links disable detail prefetching to avoid
loading detail records simply because their cards enter the viewport.

Both overview and detail queries select each species' default form explicitly.
They project the official-artwork URL from the sprite JSON; details also project
the latest cry URL. Overview, search, and detail queries use English species
display names, preserving punctuation and symbols such as `Mr. Mime` and `Nidoran♀`.

An earlier overview-query optimization reduced the measured raw response for
the first 36 entries from 1,284,127 to 9,341 bytes. That historical comparison
predates the English display-name changes; it is not a current payload-size
benchmark or a guaranteed latency gain.

**Load more Pokémon** appends entries to the existing semantic list. A status
region reports loading, success and failure, while `aria-busy` marks the list
during a request. The button remains focusable while loading, with duplicate
requests blocked. On success, focus moves to the first added card only if it is
still on the button; moving elsewhere while waiting is respected. Failed loads
preserve the existing cards and offer a retry. In-flight requests are aborted
when leaving the overview.

Loaded entries and the selected card's focus/scroll position are kept in browser
memory for returning from a detail page. **Back to results** restores that
overview's filters as well. Direct detail visits or a full reload have no saved
overview, so **All Pokémon** returns to the unfiltered first batch instead.
`/api/pokemon?after=36` serves subsequent batches through the same
server cache; its browser response uses `Cache-Control: no-store`, and invalid
cursors are rejected before making an upstream request.

Temporary service failures are thrown inside the cache boundary and converted
back to the existing error state outside it. Failed loads therefore aren't
stored as successful results, and **Try again** can retry a failed initial load.
Unexpected application/GraphQL errors still reach the error boundary. Empty
lists and missing Pokémon remain valid domain results.

The low-level fetch intentionally keeps `cache: "no-store"`: the persistent
cache stores the normalized data, not raw GraphQL responses (which can contain
errors even with HTTP 200). Once a cache entry expires, Next.js can serve its
previous value while revalidating; a failed refresh leaves the previous good
value available. Cache persistence across deployments or instances depends on
the hosting platform's Next.js cache support.

Mock data bypasses the live cache. In development, the outage simulation below
also bypasses warm entries without replacing them.

Run `pnpm test` with Node.js 22.6 or newer for six focused tests in
`tests/pokemon-critical.test.mjs`, using Node's built-in test runner:

- Detail IDs accept 1–649 and reject out-of-range or noncanonical paths.
- Filter normalization keeps URLs and cache keys consistent.
- Successful cache results are reused without mixing Pokémon IDs.
- Temporary failures remain retryable, and recovered empty results are cached.
- Connection failures and HTTP 408/429/503 become recoverable outages, while
  application and GraphQL errors still propagate.
- A disconnect while reading the response body becomes a recoverable outage,
  and a subsequent request succeeds through Apollo's HTTP link.

The tests use an in-memory cache stand-in and mocked requests; they make no
requests to the public API and do not verify Next.js cache persistence,
revalidation timing, or browser interactions. The command names the suite
explicitly, so a missing test file fails instead of silently discovering no tests.

## Design system

[DESIGN.md](DESIGN.md) documents the approved Handheld Pokédex style: palettes,
typography, layout, component states, motion, and visual guardrails. Its companion
[.impeccable/design.json](.impeccable/design.json) contains Impeccable preview
metadata; both files should change together after approved style updates. The
metadata does not control runtime styles or hook suppression settings.

The [design consistency audit](docs/design-audit.md) records the reviewed pages,
evidence, intentional exceptions, and remaining follow-ups.

## Display preferences

Settings apply immediately and are stored in the existing browser preference
record. **Enhance contrast** defaults to off, including for older saved records
that do not contain the new preference. It uses a pale blue screen, deep navy
text, opaque panels, stronger dividers and focus outlines, and removes the LCD
texture and text shadows. Pokémon type images switch to readable text badges
in this mode. The red casing and Pokémon artwork remain recognizable.

The shared screen applies the preference to its subtree; CSS custom
properties supply the alternate palette across every page. Normal colors are
kept as fallbacks when the preference is off. The preference does not affect
the motion or cry-autoplay settings.

## Detail page data

Descriptions prefer the English Pokémon Sword entry, falling back to the
nonempty English entry with the highest game-version ID. Both are requested in
the same cached detail query; if neither exists, the description stays hidden.

Footprint availability matches the bundled images in `public/footprint-assets`.
Fully transparent placeholders display **No footprint** instead of an empty
image. Update `src/lib/pokemon-footprints.ts` when replacing or extending this
asset set. Availability is stored as metadata so pages need no runtime image
decoding or client-side detection.

## Preview API failures

To simulate a connection failure on both `/` and `/1`, stop the development
server and start it with:

```bash
POKEAPI_SIMULATE_ERROR=true pnpm dev
```

The error appears inside the Pokédex screen, with a **Try again** button. While
simulation is enabled, retries keep showing the error. Restart with `pnpm dev`
to restore live requests. Alternatively, put `POKEAPI_SIMULATE_ERROR=true` in
`.env.local`, and remove it and restart when finished.

Simulation is only enabled in development and exercises the Apollo request
failure path. Use the live data source: `POKEAPI_DATA_SOURCE=mock` bypasses API
requests, including simulation. Browser DevTools' offline mode does not simulate
this outage because the Pokémon requests run on the Next.js server.

Connection failures, including disconnects while reading the response body,
timeouts (after 10 seconds), HTTP 408/429/5xx responses, and invalid JSON
responses show the service error. GraphQL errors and unexpected
application errors reach `src/app/error.tsx`. Successful empty responses remain
separate: an empty list shows the tall-grass message; a missing detail returns
the not-found page. Technical errors are logged rather than shown to visitors.

Run the request-handling checks with `pnpm test`.

## Social previews

Each page defines a descriptive title, description, and canonical URL through
`src/lib/page-metadata.ts`. Open Graph and Twitter use the same page-specific
text and `public/social-preview.png`, a shared 1200 × 630 image with dimensions,
content type, and descriptive alt text.

Detail metadata includes the Pokémon name and number, with its description when
available. Metadata and page rendering share one request-scoped lookup. Filtered
overview URLs use the validated filters for their title and canonical query;
the filter form itself uses `/filter` as its canonical URL. Temporary detail
outages receive an unavailable title and `noindex` rather than normal entry metadata.

Set `SITE_URL` to your public origin (for example, `https://your-domain.com`) in
your deployment environment so social image URLs resolve to the correct domain.
It takes priority over Netlify's `URL` and Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`; local development falls back to
`http://localhost:3000`. A custom domain should use `SITE_URL`.

Preview the image locally at [social-preview.png](http://localhost:3000/social-preview.png).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production build

Build and preview the production app locally with:

```bash
pnpm build
pnpm start
```

The app is deployed on Netlify. Set `SITE_URL` for the production origin as
described under Social previews.
