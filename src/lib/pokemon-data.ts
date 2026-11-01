import { gql } from "@apollo/client";
import { unstable_cache } from "next/cache";
import { print } from "graphql";
import type { PokemonDetail, PokemonListPage, PokemonTypes } from "@/app/types";
import { query } from "@/lib/apollo-client";
import { MOCK_POKEMON, MOCK_POKEMON_DETAIL } from "@/lib/pokemon.mock";
import { requestPokemon, type PokemonResult } from "@/lib/pokemon-request";
import { createCachedPokemonRequest } from "@/lib/pokemon-cache";

interface CryUrls {
  latest: string | null;
  legacy: string | null;
}

interface PokemonCry {
  cries: CryUrls | null;
}

interface SpriteUrl {
  front_default: string | null;
}

interface PokemonSprites {
  sprites: {
    other: {
      "official-artwork": SpriteUrl | null;
    };
  };
}

interface TypeName {
  name: PokemonTypes;
}

interface PokemonTypeNames {
  typenames: TypeName[];
}

interface PokemonTypeEntry {
  type: PokemonTypeNames;
}

interface GenerationResponse {
  region: {
    name: string;
  } | null;
}

interface PokemonFlavorText {
  flavor_text: string | null;
}

interface PokemonSpeciesName {
  genus: string | null;
}

interface PokemonForm {
  pokemontypes: PokemonTypeEntry[];
}

interface PokemonListForm extends PokemonForm {
  pokemonsprites: { spriteUrl: string | null }[];
}

interface PokemonDetailForm extends PokemonForm {
  pokemonsprites: PokemonSprites[];
  pokemoncries: PokemonCry[];

  height: number | null;
  weight: number | null;
}

interface PokemonSpecies<Form> {
  id: number;
  name: string;
  pokemons: Form[];
}

interface PokemonDetailSpecies extends PokemonSpecies<PokemonDetailForm> {
  generation: GenerationResponse | null;
  pokemonspeciesflavortexts: PokemonFlavorText[] | null;
  pokemonspeciesnames: PokemonSpeciesName[] | null;
}

const POKEMON_PAGE_SIZE = 36;
const POKEMON_MAX_ID = 649;

const GET_POKEMON = gql`
  query GetPokemon($afterId: Int!, $limit: Int!) {
    pokemon: pokemonspecies(
      limit: $limit
      order_by: { id: asc }
      where: { id: { _gt: $afterId, _lte: 649 } }
    ) {
      id
      name
      pokemons(where: { is_default: { _eq: true } }, limit: 1) {
        pokemontypes {
          type {
            typenames(where: { language_id: { _eq: 9 } }) {
              name
            }
          }
        }
        pokemonsprites {
          spriteUrl: sprites(path: "other.official-artwork.front_default")
        }
      }
    }
    catalog: pokemonspecies_aggregate(where: { id: { _lte: 649 } }) {
      aggregate {
        count
      }
    }
  }
`;

const GET_SINGLE_POKEMON = gql`
  query GetSinglePokemon($id: Int!) {
    pokemon: pokemonspecies(limit: 1, where: { id: { _eq: $id } }) {
      id
      name
      pokemons {
        pokemontypes {
          type {
            typenames(where: { language_id: { _eq: 9 } }) {
              name
            }
          }
        }
        pokemoncries {
          cries
        }
        height
        weight
        pokemonsprites {
          sprites
        }
      }
      generation {
        region {
          name
        }
      }
      pokemonspeciesflavortexts(
        where: { language_id: { _eq: 9 }, version_id: { _eq: 33 } }
      ) {
        flavor_text
      }
      pokemonspeciesnames(where: { language_id: { _eq: 9 } }) {
        genus
      }
    }
  }
`;

function getTypeNames(forms: PokemonForm[]): PokemonTypes[] {
  const firstForm = forms[0];

  if (!firstForm) return [];

  return firstForm.pokemontypes.flatMap(({ type }) =>
    type.typenames.map(({ name }) => name),
  );
}

function getSpriteUrl(forms: PokemonDetailForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null;

  return (
    firstForm.pokemonsprites[0]?.sprites?.other["official-artwork"]
      ?.front_default ?? null
  );
}

function getLatestCry(forms: PokemonDetailForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null;

  return firstForm.pokemoncries[0]?.cries?.latest ?? null;
}

async function requestPokemonList(
  afterId: number,
): Promise<PokemonResult<PokemonListPage>> {
  const result = await requestPokemon(() =>
    query<{
      pokemon: PokemonSpecies<PokemonListForm>[];
      catalog: { aggregate: { count: number } };
    }>({
      query: GET_POKEMON,
      variables: {
        afterId,
        limit: Math.min(POKEMON_PAGE_SIZE, POKEMON_MAX_ID - afterId),
      },
    }),
  );

  if (result.status === "unavailable") return result;

  const pokemons = result.data.pokemon.map(({ id, name, pokemons }) => ({
    id,
    name,
    types: getTypeNames(pokemons),
    spriteUrl: pokemons[0]?.pokemonsprites[0]?.spriteUrl ?? null,
  }));
  const lastId = pokemons.at(-1)?.id;

  return {
    status: "success",
    data: {
      pokemons,
      total: result.data.catalog.aggregate.count,
      nextCursor:
        pokemons.length === POKEMON_PAGE_SIZE &&
        lastId &&
        lastId < POKEMON_MAX_ID
          ? lastId
          : null,
    },
  };
}

async function requestPokemonDetail(
  id: number,
): Promise<PokemonResult<PokemonDetail | null>> {
  const result = await requestPokemon(() =>
    query<{ pokemon: PokemonDetailSpecies[] }>({
      query: GET_SINGLE_POKEMON,
      variables: { id },
    }),
  );

  if (result.status === "unavailable") return result;

  const firstResult = result.data.pokemon[0];

  if (!firstResult) return { status: "success", data: null };

  return {
    status: "success",
    data: {
      id: firstResult.id,
      name: firstResult.name,
      types: getTypeNames(firstResult.pokemons),
      cryUrl: getLatestCry(firstResult.pokemons),
      spriteUrl: getSpriteUrl(firstResult.pokemons),
      height: firstResult.pokemons[0]?.height ?? null,
      weight: firstResult.pokemons[0]?.weight ?? null,
      region: firstResult.generation?.region?.name ?? null,
      flavorText:
        firstResult.pokemonspeciesflavortexts?.[0]?.flavor_text ?? null,
      genus: firstResult.pokemonspeciesnames?.[0]?.genus ?? null,
    },
  };
}

// Include the query in each key so query changes cannot reuse an old result.
const cachedPokemonList = createCachedPokemonRequest(
  requestPokemonList,
  ["pokemon-list-v1", print(GET_POKEMON)],
  unstable_cache,
);

const cachedPokemonDetail = createCachedPokemonRequest(
  requestPokemonDetail,
  ["pokemon-detail-v1", print(GET_SINGLE_POKEMON)],
  unstable_cache,
);

export async function getPokemon(
  afterId = 0,
): Promise<PokemonResult<PokemonListPage>> {
  if (!Number.isInteger(afterId) || afterId < 0 || afterId >= POKEMON_MAX_ID) {
    throw new RangeError("Invalid Pokémon page cursor.");
  }

  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    const catalog = MOCK_POKEMON.filter(({ id }) => id <= POKEMON_MAX_ID);
    const pokemons = catalog
      .filter(({ id }) => id > afterId)
      .slice(0, POKEMON_PAGE_SIZE);
    const lastId = pokemons.at(-1)?.id;
    return {
      status: "success",
      data: {
        pokemons,
        total: catalog.length,
        nextCursor:
          lastId && catalog.some(({ id }) => id > lastId) ? lastId : null,
      },
    };
  }
  return cachedPokemonList(afterId);
}

export async function getSinglePokemon(
  id: number,
): Promise<PokemonResult<PokemonDetail | null>> {
  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    return {
      status: "success",
      data: id === MOCK_POKEMON_DETAIL.id ? MOCK_POKEMON_DETAIL : null,
    };
  }
  return cachedPokemonDetail(id);
}
