import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import PokeCry from "@/components/pokecry";
import { PokedexError } from "@/components/pokedex-error";
import { PokemonDetailBackLink } from "@/components/pokemon-detail-back-link";
import PokemonDetailSprite from "@/components/pokemon-detail-sprite";
import PokemonTypeBadge from "@/components/pokemon-type-badge";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSinglePokemon } from "@/lib/pokemon-data";
import { getPokemonFootprintUrl } from "@/lib/pokemon-footprints";
import { parsePokemonId } from "@/lib/pokemon-id";
import formatDexNumber from "@/utilities/format-dex-number";
import formatFlavorText from "@/utilities/format-flavor-text";
import {
  formatPokemonHeight,
  formatPokemonWeight,
} from "@/utilities/format-pokemon-measurements";

type Props = {
  params: Promise<{ id: string }>;
};

// Metadata and page rendering share the same result within this request.
const loadPokemon = cache(async (id: string) => {
  const pokemonId = parsePokemonId(id);

  if (pokemonId === null) {
    notFound();
  }

  const result = await getSinglePokemon(pokemonId);

  if (result.status === "unavailable") return result;

  const pokemon = result.data;

  if (!pokemon) {
    notFound();
  }

  return { status: "success" as const, data: pokemon };
});

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await loadPokemon(id);
  const number = formatDexNumber(Number(id));

  if (result.status === "unavailable") {
    return {
      ...createPageMetadata(
        `Pokémon ${number} unavailable`,
        "The Pokémon data service is temporarily unavailable. Please try again shortly.",
        `/${id}`,
      ),
      robots: { index: false },
    };
  }

  const pokemon = result.data;
  const name = pokemon.name;

  return createPageMetadata(
    `${name} ${number}`,
    pokemon.flavorText
      ? `${name} ${number}. ${formatFlavorText(pokemon.flavorText)}`
      : `Explore ${name} ${number}: types, measurements, artwork, and more.`,
    `/${pokemon.id}`,
  );
}

export default async function PokemonDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await loadPokemon(id);

  if (result.status === "unavailable") return <PokedexError />;

  const pokemon = result.data;
  const footprintUrl = getPokemonFootprintUrl(pokemon.id);

  return (
    <article className="pokemon-detail">
      <div className="pokemon-detail-header">
        <p className="pokemon-detail-number">
          <span className="sr-only">National Pokédex entry </span>
          {formatDexNumber(pokemon.id)}
        </p>
        <PokemonDetailBackLink />
      </div>

      <div className="pokemon-detail-record">
        <div className="pokemon-detail-specimen">
          {pokemon.spriteUrl ? (
            <PokemonDetailSprite
              key={pokemon.spriteUrl}
              src={pokemon.spriteUrl}
              alt={pokemon.name}
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
              <li key={pokemonType.id}>
                <PokemonTypeBadge type={pokemonType} isDetail />
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
          {footprintUrl && (
            <div className="pokemon-detail-footprint-stamp">
              <Image
                src={footprintUrl}
                height={32}
                width={32}
                alt={`${pokemon.name} footprint`}
                className="pokemon-detail-footprint-image"
              />
            </div>
          )}
          <figcaption>{footprintUrl ? "Footprint" : "No footprint"}</figcaption>
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
