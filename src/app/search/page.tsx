import { getPokemonSearchCatalog } from "@/lib/pokemon-data";
import PokemonSearch from "@/components/pokemon-search";
import { PokedexError } from "@/components/pokedex-error";

export default async function Search() {
  const result = await getPokemonSearchCatalog();

  if (result.status === "unavailable") return <PokedexError />;

  if (result.data.length === 0) {
    return <p>No Pokémon are available to search. Please try again later.</p>;
  }

  return <PokemonSearch pokemons={result.data} />;
}
