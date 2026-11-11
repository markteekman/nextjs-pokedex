import PokemonFilters from "@/components/pokemon-filters";
import {
  getPokemonFilterKey,
  parsePokemonFilters,
  type PokemonFilterSearchParams,
} from "@/lib/pokemon-filters";

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
