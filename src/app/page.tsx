import { getPokemon } from "@/lib/pokemon-data";
import { PokedexError } from "@/components/pokedex-error";
import { PokeSlot } from "../components/pokeslot";

export default async function Home() {
  const result = await getPokemon();

  if (result.status === "unavailable") return <PokedexError />;

  const pokemons = result.data;

  if (pokemons.length === 0) {
    return <p>No Pokémon found. Try looking in the tall grass.</p>;
  }

  return (
    <div className="pokedex-index">
      <div className="pokedex-index-header">
        <h1 className="text-xl">National Pokédex</h1>
        <p className="pokedex-index-count">
          {String(pokemons.length).padStart(3, "0")} entries
        </p>
      </div>
      <ul className="pokedex-grid grid grid-cols-3">
        {pokemons.map((pokemon) => (
          <PokeSlot
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            src={pokemon.spriteUrl}
          />
        ))}
      </ul>
    </div>
  );
}
