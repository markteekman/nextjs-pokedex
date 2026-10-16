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
