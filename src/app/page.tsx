import { getPokemon } from "@/lib/pokemon-data";
import { PokedexError } from "@/components/pokedex-error";
import PokemonIndex from "@/components/pokemon-index";

export default async function Home() {
  const result = await getPokemon();

  if (result.status === "unavailable") return <PokedexError />;

  if (result.data.pokemons.length === 0) {
    return <p>No Pokémon found. Try looking in the tall grass.</p>;
  }

  return <PokemonIndex initialPage={result.data} />;
}
