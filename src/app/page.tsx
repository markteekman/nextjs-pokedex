import { PokedexError } from "@/components/pokedex-error";
import PokemonIndex from "@/components/pokemon-index";
import { createPageMetadata, POKEDEX_DESCRIPTION } from "@/lib/page-metadata";
import { getPokemon } from "@/lib/pokemon-data";
import {
  getPokemonFilterHref,
  getPokemonFilterKey,
  getPokemonFilterSummary,
  type PokemonFilterSearchParams,
  parsePokemonFilters,
} from "@/lib/pokemon-filters";

type Props = {
  searchParams: Promise<PokemonFilterSearchParams>;
};

export async function generateMetadata({ searchParams }: Props) {
  const filters = parsePokemonFilters(await searchParams);
  const summary = getPokemonFilterSummary(filters);

  return createPageMetadata(
    summary ? `${summary} Pokémon` : "National Pokédex",
    summary
      ? `Browse Pokémon matching ${summary} in the National Pokédex.`
      : POKEDEX_DESCRIPTION,
    getPokemonFilterHref(filters),
  );
}

export default async function Home({ searchParams }: Props) {
  const filters = parsePokemonFilters(await searchParams);
  const filterKey = getPokemonFilterKey(filters);
  const result = await getPokemon(0, filters);

  if (result.status === "unavailable") return <PokedexError />;

  return (
    <PokemonIndex key={filterKey} initialPage={result.data} filters={filters} />
  );
}
