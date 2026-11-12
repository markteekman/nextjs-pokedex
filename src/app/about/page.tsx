import { PokedexPageHeader } from "@/components/pokedex-page-header";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "About",
  "Learn why Pokédex was built, what powers it, and how accessibility shaped the experience.",
  "/about",
);

const stack = [
  ["Next.js", "App Router and server-first foundation"],
  ["TypeScript", "Safer, clearer application code"],
  ["GraphQL + Apollo", "A focused and typed data layer"],
  ["Tailwind CSS", "Responsive, maintainable styling"],
  ["React Aria", "Accessible interaction primitives"],
  ["CSS animations", "Purposeful interface feedback"],
] as const;

const accessibilityPrinciples = [
  "Semantic structure that works beyond the screen",
  "Complete keyboard access and visible focus states",
  "Readable contrast, useful labels, and reduced-motion support",
] as const;

export default function About() {
  return (
    <article aria-labelledby="about-title" className="pokemon-about">
      <PokedexPageHeader
        as="header"
        title="About"
        headingId="about-title"
        trailing="Pokédex"
      />
      <p className="pokemon-about-intro">
        A modern, accessible Pokédex built to turn a familiar world into a
        practical place to learn.
      </p>
      <section
        aria-labelledby="mission-title"
        className="pokemon-about-section"
      >
        <h2 id="mission-title">Mission</h2>
        <div>
          <p>
            Pokédex began as a hands-on side project: a way to explore a modern
            web stack by building something playful, useful, and more ambitious
            than a tutorial exercise.
          </p>
          <p>
            It turns data from the <a href="https://pokeapi.co/">PokéAPI</a>{" "}
            into a fast, responsive field guide for discovering Pokémon,
            comparing their types, and finding the details that matter.
          </p>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="pokemon-about-section">
        <h2 id="stack-title">System components</h2>
        <dl className="pokemon-about-stack">
          {stack.map(([technology, purpose]) => (
            <div key={technology}>
              <dt>{technology}</dt>
              <dd>{purpose}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="access-title" className="pokemon-about-section">
        <h2 id="access-title">Built for more trainers</h2>
        <p>
          Accessibility is part of the build, not a final checklist. Pokédex
          follows WCAG 2.2 principles and aims for an inclusive experience
          across devices, input methods, and user preferences.
        </p>
        <ul className="pokemon-about-principles">
          {accessibilityPrinciples.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>

      <footer className="pokemon-about-footer">
        <p>
          The result is both a finished Pokédex and a record of learning in
          public—designed, coded, and refined by{" "}
          <a href="https://markteekman.nl">Mark Teekman</a>.
        </p>
        <p className="pokemon-about-credit">
          Powered by PokéAPI · Deployed on Netlify
        </p>
      </footer>
    </article>
  );
}
