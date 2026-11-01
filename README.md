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
entries; changing a GraphQL query also changes its cache key. The overview
still requests 36 Pokémon at this checkpoint.

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

Run `npm test` for deterministic cache-policy tests. They check cache hits,
failure/retry behavior, per-ID isolation, query-key changes, empty results and
outage simulation without making requests to the public API.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
