import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Next.js Pokédex App",
  description:
    "Learn why PokeCenter was built, what powers it, and how accessibility shaped the experience.",
};

const stack = [
  ["Next.js", "App Router and server-first foundation"],
  ["TypeScript", "Safer, clearer application code"],
  ["GraphQL + Apollo", "A focused and typed data layer"],
  ["Tailwind CSS", "Responsive, maintainable styling"],
  ["React Aria", "Accessible interaction primitives"],
  ["Motion", "Purposeful interface feedback"],
] as const;

const accessibilityPrinciples = [
  "Semantic structure that works beyond the screen",
  "Complete keyboard access and visible focus states",
  "Readable contrast, useful labels, and reduced-motion support",
] as const;

const linkStyles =
  "underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

export default function About() {
  return (
    <article aria-labelledby="about-title" className="text-sm leading-relaxed">
      <header className="border-b border-cyan-950/30 pb-5">
        <div className="mb-3 flex items-center justify-between gap-4 text-[0.65rem] tracking-[0.16em] uppercase opacity-70">
          <p>Project file</p>
          <p>No. 001</p>
        </div>
        <h1 id="about-title" className="text-3xl leading-none">
          PokeCenter
        </h1>
        <p className="mt-3 max-w-xl text-base leading-snug">
          A modern, accessible Pokédex built to turn a familiar world into a
          practical place to learn.
        </p>
      </header>

      <section aria-labelledby="mission-title" className="py-6">
        <h2
          id="mission-title"
          className="mb-2 text-xs tracking-[0.14em] uppercase opacity-70"
        >
          Mission
        </h2>
        <div className="max-w-2xl space-y-3">
          <p>
            PokeCenter began as a hands-on side project: a way to explore a
            modern web stack by building something playful, useful, and more
            ambitious than a tutorial exercise.
          </p>
          <p>
            It turns data from the{" "}
            <a href="https://pokeapi.co/" className={linkStyles}>
              PokéAPI
            </a>{" "}
            into a fast, responsive field guide for discovering Pokémon,
            comparing their types, and finding the details that matter.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="stack-title"
        className="border-y border-cyan-950/30 py-6"
      >
        <h2
          id="stack-title"
          className="mb-4 text-xs tracking-[0.14em] uppercase opacity-70"
        >
          System components
        </h2>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {stack.map(([technology, purpose]) => (
            <div key={technology}>
              <dt className="font-bold">{technology}</dt>
              <dd className="mt-0.5 text-xs leading-snug opacity-75">
                {purpose}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="access-title" className="py-6">
        <h2
          id="access-title"
          className="mb-2 text-xs tracking-[0.14em] uppercase opacity-70"
        >
          Built for more trainers
        </h2>
        <p className="max-w-2xl">
          Accessibility is part of the build, not a final checklist. PokeCenter
          follows WCAG 2.2 principles and aims for an inclusive experience
          across devices, input methods, and user preferences.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {accessibilityPrinciples.map((principle) => (
            <li
              key={principle}
              className="border-l-2 border-cyan-950/50 pl-3 text-xs leading-snug"
            >
              {principle}
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-cyan-950/30 pt-5">
        <p className="max-w-2xl">
          The result is both a finished Pokédex and a record of learning in
          public—designed, coded, and refined by{" "}
          <a href="https://markteekman.nl" className={linkStyles}>
            Mark Teekman
          </a>
          .
        </p>
        <p className="mt-4 text-[0.65rem] tracking-[0.14em] uppercase opacity-70">
          Powered by PokéAPI · Deployed on Netlify
        </p>
      </footer>
    </article>
  );
}
