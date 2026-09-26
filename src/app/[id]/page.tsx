import PokeCry from "@/components/pokecry";
import PokeSprite from "@/components/pokesprite";
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

  if (!Number.isInteger(pokemonId)) {
    notFound();
  }

  const pokemon = await getSinglePokemon(pokemonId);

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
      <PokeCry id={pokemonId} />
      {pokemon.region && <p className="capitalize">Region: {pokemon.region}</p>}
      <p>Entry number: {formatDexNumber(pokemon.id)} </p>
      <p>TODO: Height</p>
      <p>TODO: Weight</p>
      <p>TODO: Sub type</p>
      <p>TODO: Description</p>
      <p>TODO: Footprint</p>
    </div>
  );
}
