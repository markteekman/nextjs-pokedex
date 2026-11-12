import PokemonFilters from "@/components/pokemon-filters";
import { createPageMetadata } from "@/lib/page-metadata";
import {
  getPokemonFilterKey,
  type PokemonFilterSearchParams,
  parsePokemonFilters,
} from "@/lib/pokemon-filters";

export const metadata = createPageMetadata(
  "Filter Pokémon",
  "Filter the National Pokédex by generation and type to find matching Pokémon.",
  "/filter",
);

export default async function Filter({
  searchParams,
}: {
  searchParams: Promise<PokemonFilterSearchParams>;
}) {
  const filters = parsePokemonFilters(await searchParams);

  return (
    <PokemonFilters
      key={getPokemonFilterKey(filters)}
      initialFilters={filters}
    />
  );
}
