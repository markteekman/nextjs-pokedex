This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Pokémon data caching

Successful normalized overview and detail results use Next.js's persistent Data
Cache, with a 24-hour revalidation interval. Detail IDs have separate cache
entries; changing a GraphQL query also changes its cache key.

The overview starts with 36 Pokémon and loads further batches on demand, up to
National Pokédex #649. Each batch has its own cache entry, keyed by the last
species ID from the previous batch. The final batch contains only #649. An
aggregate count in the same GraphQL request supplies the catalog total. Reading
the whole catalog takes 19 overview queries on a cold cache; shared warm batches
are reused across visitors. Overview links disable detail prefetching to avoid
loading detail records simply because their cards enter the viewport.

The overview requests only each species' default form and projects the single
official-artwork URL from the sprite JSON. Detail pages retain their own query.
For the same first 36 entries, the measured raw GraphQL response decreased from
1,284,127 to 9,341 bytes; names, types and artwork URLs were unchanged. Those are
uncompressed JSON sizes, not browser page sizes or a guaranteed latency gain.
The paginated query also includes the small aggregate count described above.

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

Connection failures, timeouts (after 10 seconds), HTTP 408/429/5xx responses, and
invalid JSON responses show the service error. GraphQL errors and unexpected
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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
