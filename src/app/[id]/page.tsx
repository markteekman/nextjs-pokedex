import PokeCry from "@/components/pokecry";
import PokeSprite from "@/components/pokesprite";
import { PokedexError } from "@/components/pokedex-error";
import PokemonTypeBadge from "@/components/pokemon-type-badge";
import { getSinglePokemon } from "@/lib/pokemon-data";
import { notFound } from "next/navigation";
import formatDexNumber from "@/utilities/format-dex-number";

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemonId = Number(id);

  if (!Number.isInteger(pokemonId) || pokemonId < 1) {
    notFound();
  }

  const result = await getSinglePokemon(pokemonId);

  if (result.status === "unavailable") return <PokedexError />;

  const pokemon = result.data;

  if (!pokemon) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-2xl first-letter:capitalize">{pokemon.name}</h2>
      <p>Types:</p>
      {pokemon.types.map((pokemonType) => (
        <PokemonTypeBadge key={pokemonType} variant={pokemonType}>
          {pokemonType}
        </PokemonTypeBadge>
      ))}
      <PokeSprite id={pokemonId} />
      {pokemon.cryUrl && <PokeCry src={pokemon.cryUrl} />}
      {pokemon.region && <p className="capitalize">Region: {pokemon.region}</p>}
      <p>Entry number: {formatDexNumber(pokemon.id)} </p>
      {pokemon.height !== null && <p>Height: {pokemon.height}</p>}
      {pokemon.weight !== null && <p>Weight: {pokemon.weight}</p>}
      <p>TODO: Sub type</p>
      <p>TODO: Description</p>
      <p>TODO: Footprint</p>
    </div>
  );
}
