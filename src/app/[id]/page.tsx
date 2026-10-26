import PokeCry from "@/components/pokecry";
import PokeSprite from "@/components/pokesprite";
import { PokedexError } from "@/components/pokedex-error";
import PokemonTypeBadge from "@/components/pokemon-type-badge";
import { getSinglePokemon } from "@/lib/pokemon-data";
import { notFound } from "next/navigation";
import formatDexNumber from "@/utilities/format-dex-number";
import {
  formatPokemonHeight,
  formatPokemonWeight,
} from "@/utilities/format-pokemon-measurements";
import { FormatFlavorText } from "@/utilities/format-flavor-text";

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
      {pokemon.spriteUrl && <PokeSprite src={pokemon.spriteUrl} />}
      {pokemon.cryUrl && <PokeCry src={pokemon.cryUrl} />}
      {pokemon.region && <p className="capitalize">Region: {pokemon.region}</p>}
      <p>Entry number: {formatDexNumber(pokemon.id)} </p>
      {pokemon.height !== null && (
        <p>Height: {formatPokemonHeight(pokemon.height)}</p>
      )}
      {pokemon.weight !== null && (
        <p>Weight: {formatPokemonWeight(pokemon.weight)}</p>
      )}
      <p>TODO: Sub type</p>
      {pokemon.flavorText && (
        <p>Description: {FormatFlavorText(pokemon.flavorText)}</p>
      )}
      <p>TODO: Footprint</p>
    </div>
  );
}
