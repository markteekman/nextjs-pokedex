import { LightIndicators } from "./light-indicators";

export function Header() {
  return (
    <header className="relative p-8 block-48">
      <div className="top-shape bg-pokedex-case-outer absolute top-0 left-0 w-full translate-y-10 p-8 block-48"></div>
      <div className="top-shape bg-pokedex-case absolute top-0 left-0 w-full rounded-tl-4xl rounded-tr-4xl p-8 block-48"></div>
      <LightIndicators />
      <div className="pokedex-header-vents" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </header>
  );
}
