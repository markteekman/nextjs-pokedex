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
import formatFlavorText from "@/utilities/format-flavor-text";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <article className="pokemon-detail">
      <div className="pokemon-detail-header">
        <p className="pokemon-detail-number">
          <span className="sr-only">National Pokédex entry </span>
          {formatDexNumber(pokemon.id)}
        </p>
        <Link href="/" className="pokemon-detail-back">
          <ArrowLeft size={14} aria-hidden="true" />
          All Pokémon
        </Link>
      </div>

      <div className="pokemon-detail-record">
        <div className="pokemon-detail-specimen">
          {pokemon.spriteUrl ? (
            <PokeSprite
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              variant="detail"
              preload
            />
          ) : (
            <p>Image unavailable</p>
          )}
        </div>
        <div className="pokemon-detail-identity">
          <h1>{pokemon.name}</h1>
          {pokemon.genus && (
            <p className="pokemon-detail-genus">{pokemon.genus}</p>
          )}
          <ul className="pokemon-detail-types" aria-label="Types">
            {pokemon.types.map((pokemonType) => (
              <li key={pokemonType}>
                <PokemonTypeBadge variant={pokemonType}>
                  {pokemonType}
                </PokemonTypeBadge>
              </li>
            ))}
          </ul>
          <dl className="pokemon-detail-facts">
            {pokemon.height !== null && (
              <div>
                <dt>Height</dt>
                <dd>{formatPokemonHeight(pokemon.height)}</dd>
              </div>
            )}
            {pokemon.weight !== null && (
              <div>
                <dt>Weight</dt>
                <dd>{formatPokemonWeight(pokemon.weight)}</dd>
              </div>
            )}
            {pokemon.region && (
              <div>
                <dt>Region</dt>
                <dd className="capitalize">{pokemon.region}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="pokemon-detail-identification">
        <figure className="pokemon-detail-footprint">
          <div className="pokemon-detail-footprint-stamp">
            <Image
              src={`/footprint-assets/${pokemon.id}.png`}
              height={32}
              width={32}
              alt={`${pokemon.name} footprint`}
              className="pokemon-detail-footprint-image"
            />
          </div>
          <figcaption>Footprint</figcaption>
        </figure>
        {pokemon.cryUrl && (
          <PokeCry
            key={pokemon.cryUrl}
            src={pokemon.cryUrl}
            name={pokemon.name}
          />
        )}
      </div>

      {pokemon.flavorText && (
        <section
          className="pokemon-detail-description"
          aria-labelledby="entry-heading"
        >
          <h2 id="entry-heading">Pokédex entry</h2>
          <p>{formatFlavorText(pokemon.flavorText)}</p>
        </section>
      )}
    </article>
  );
}
