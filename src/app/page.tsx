import { getPokemon } from "@/lib/pokemon-data";
import { PokedexError } from "@/components/pokedex-error";
import PokemonIndex from "@/components/pokemon-index";
import {
  getPokemonFilterKey,
  parsePokemonFilters,
  type PokemonFilterSearchParams,
} from "@/lib/pokemon-filters";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<PokemonFilterSearchParams>;
}) {
  const filters = parsePokemonFilters(await searchParams);
  const filterKey = getPokemonFilterKey(filters);
  const result = await getPokemon(0, filters);

  if (result.status === "unavailable") return <PokedexError />;

  return (
    <PokemonIndex key={filterKey} initialPage={result.data} filters={filters} />
  );
}
