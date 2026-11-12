import { PokedexError } from "@/components/pokedex-error";
import PokemonSearch from "@/components/pokemon-search";
import { createPageMetadata } from "@/lib/page-metadata";
import { getPokemonSearchCatalog } from "@/lib/pokemon-data";

export const metadata = createPageMetadata(
  "Search Pokémon",
  "Search 649 Pokémon by name and open their Pokédex entries, artwork, types, and descriptions.",
  "/search",
);

export default async function Search() {
  const result = await getPokemonSearchCatalog();

  if (result.status === "unavailable") return <PokedexError />;

  if (result.data.length === 0) {
    return <p>No Pokémon are available to search. Please try again later.</p>;
  }

  return <PokemonSearch pokemons={result.data} />;
}
