import { gql } from "@apollo/client";
import { print } from "graphql";
import { unstable_cache } from "next/cache";
import type {
  PokemonDetail,
  PokemonListPage,
  PokemonSearchItem,
  PokemonType,
  PokemonTypeName,
} from "@/app/types";
import { getClient, query } from "@/lib/apollo-client";
import { MOCK_POKEMON, MOCK_POKEMON_DETAIL } from "@/lib/pokemon.mock";
import { createCachedPokemonRequest } from "@/lib/pokemon-cache";
import {
  getPokemonFilterConditions,
  getPokemonFilterKey,
  matchesPokemonFilters,
  type PokemonFilters,
  parsePokemonFilters,
} from "@/lib/pokemon-filters";
import { POKEMON_MAX_ID } from "@/lib/pokemon-id";
import { type PokemonResult, requestPokemon } from "@/lib/pokemon-request";

interface TypeName {
  name: PokemonTypeName;
}

interface PokemonTypeNames {
  id: number;
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
  name: string | null;
  genus?: string | null;
}

interface PokemonForm {
  pokemontypes: PokemonTypeEntry[];
}

interface PokemonListForm extends PokemonForm {
  pokemonsprites: { spriteUrl: string | null }[];
}

interface PokemonDetailForm extends PokemonListForm {
  pokemoncries: { cryUrl: string | null }[];

  height: number | null;
  weight: number | null;
}

interface PokemonSpeciesIdentity {
  id: number;
  pokemonspeciesnames: PokemonSpeciesName[] | null;
}

interface PokemonSpecies<Form> extends PokemonSpeciesIdentity {
  pokemons: Form[];
}

interface PokemonDetailSpecies extends PokemonSpecies<PokemonDetailForm> {
  generation: GenerationResponse | null;
  pokemonspeciesflavortexts: PokemonFlavorText[] | null;
  fallbackFlavorTexts: PokemonFlavorText[] | null;
}

const POKEMON_PAGE_SIZE = 36;

const GET_POKEMON = gql`
  query GetPokemon(
    $where: pokemonspecies_bool_exp!
    $catalogWhere: pokemonspecies_bool_exp!
    $limit: Int!
  ) {
    pokemon: pokemonspecies(
      limit: $limit
      order_by: { id: asc }
      where: $where
    ) {
      id
      pokemonspeciesnames(where: { language_id: { _eq: 9 } }, limit: 1) {
        name
      }
      pokemons(where: { is_default: { _eq: true } }, limit: 1) {
        pokemontypes {
          type {
            id
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
    catalog: pokemonspecies_aggregate(where: $catalogWhere) {
      aggregate {
        count
      }
    }
  }
`;

const GET_POKEMON_SEARCH_CATALOG = gql`
  query GetPokemonSearchCatalog($maxId: Int!) {
    pokemon: pokemonspecies(
      limit: $maxId
      order_by: { id: asc }
      where: { id: { _gte: 1, _lte: $maxId } }
    ) {
      id
      pokemonspeciesnames(where: { language_id: { _eq: 9 } }, limit: 1) {
        name
      }
    }
  }
`;

const GET_SINGLE_POKEMON = gql`
  query GetSinglePokemon($id: Int!) {
    pokemon: pokemonspecies(limit: 1, where: { id: { _eq: $id } }) {
      id
      pokemons(where: { is_default: { _eq: true } }, limit: 1) {
        pokemontypes {
          type {
            id
            typenames(where: { language_id: { _eq: 9 } }) {
              name
            }
          }
        }
        pokemoncries {
          cryUrl: cries(path: "latest")
        }
        height
        weight
        pokemonsprites {
          spriteUrl: sprites(path: "other.official-artwork.front_default")
        }
      }
      generation {
        region {
          name
        }
      }
      pokemonspeciesflavortexts(
        where: { language_id: { _eq: 9 }, version_id: { _eq: 33 } }
        limit: 1
      ) {
        flavor_text
      }
      fallbackFlavorTexts: pokemonspeciesflavortexts(
        where: { language_id: { _eq: 9 }, flavor_text: { _neq: "" } }
        order_by: { version_id: desc }
        limit: 1
      ) {
        flavor_text
      }
      pokemonspeciesnames(where: { language_id: { _eq: 9 } }, limit: 1) {
        name
        genus
      }
    }
  }
`;

function getPokemonName(species: PokemonSpeciesIdentity): string {
  return species.pokemonspeciesnames?.[0]?.name?.trim() || "Unknown Pokémon";
}

function getTypes(forms: PokemonForm[]): PokemonType[] {
  const firstForm = forms[0];

  if (!firstForm) return [];

  return firstForm.pokemontypes.flatMap(({ type }) =>
    type.typenames.map(({ name }) => ({
      id: type.id,
      name,
    })),
  );
}

function getSpriteUrl(forms: PokemonDetailForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null;

  return firstForm.pokemonsprites[0]?.spriteUrl ?? null;
}

function getLatestCry(forms: PokemonDetailForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null;

  return firstForm.pokemoncries[0]?.cryUrl ?? null;
}

async function requestPokemonList(
  afterId: number,
  filterKey: string,
): Promise<PokemonResult<PokemonListPage>> {
  const filters = parsePokemonFilters(new URLSearchParams(filterKey));
  const catalogWhere = {
    id: { _gte: 1, _lte: POKEMON_MAX_ID },
    ...getPokemonFilterConditions(filters),
  };
  const client = getClient();
  const result = await requestPokemon(() =>
    client.query<{
      pokemon: PokemonSpecies<PokemonListForm>[];
      catalog: { aggregate: { count: number } };
    }>({
      query: GET_POKEMON,
      variables: {
        where: {
          ...catalogWhere,
          id: { ...catalogWhere.id, _gt: afterId },
        },
        catalogWhere,
        // A look-ahead entry tells us whether a sparse filtered page has more.
        limit: Math.min(POKEMON_PAGE_SIZE + 1, POKEMON_MAX_ID - afterId),
      },
    }),
  );

  if (result.status === "unavailable") return result;

  const hasMore = result.data.pokemon.length > POKEMON_PAGE_SIZE;
  const pokemons = result.data.pokemon
    .slice(0, POKEMON_PAGE_SIZE)
    .map((species) => ({
      id: species.id,
      name: getPokemonName(species),
      types: getTypes(species.pokemons),
      spriteUrl: species.pokemons[0]?.pokemonsprites[0]?.spriteUrl ?? null,
    }));
  const lastId = pokemons.at(-1)?.id;

  return {
    status: "success",
    data: {
      pokemons,
      total: result.data.catalog.aggregate.count,
      nextCursor: hasMore && lastId ? lastId : null,
    },
  };
}

async function requestPokemonSearchCatalog(): Promise<
  PokemonResult<PokemonSearchItem[]>
> {
  const result = await requestPokemon(() =>
    query<{ pokemon: PokemonSpeciesIdentity[] }>({
      query: GET_POKEMON_SEARCH_CATALOG,
      variables: { maxId: POKEMON_MAX_ID },
    }),
  );

  if (result.status === "unavailable") return result;

  return {
    status: "success",
    data: result.data.pokemon.map((species) => ({
      id: species.id,
      name: getPokemonName(species),
    })),
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
      name: getPokemonName(firstResult),
      types: getTypes(firstResult.pokemons),
      cryUrl: getLatestCry(firstResult.pokemons),
      spriteUrl: getSpriteUrl(firstResult.pokemons),
      height: firstResult.pokemons[0]?.height ?? null,
      weight: firstResult.pokemons[0]?.weight ?? null,
      region: firstResult.generation?.region?.name ?? null,
      flavorText:
        firstResult.pokemonspeciesflavortexts?.[0]?.flavor_text?.trim() ||
        firstResult.fallbackFlavorTexts?.[0]?.flavor_text?.trim() ||
        null,
      genus: firstResult.pokemonspeciesnames?.[0]?.genus ?? null,
    },
  };
}

// Include the query in each key so query changes cannot reuse an old result.
const cachedPokemonList = createCachedPokemonRequest(
  requestPokemonList,
  ["pokemon-list-v2", print(GET_POKEMON)],
  unstable_cache,
);

const cachedPokemonSearchCatalog = createCachedPokemonRequest(
  requestPokemonSearchCatalog,
  [
    "pokemon-search-catalog-v1",
    print(GET_POKEMON_SEARCH_CATALOG),
    String(POKEMON_MAX_ID),
  ],
  unstable_cache,
);

const cachedPokemonDetail = createCachedPokemonRequest(
  requestPokemonDetail,
  ["pokemon-detail-v1", print(GET_SINGLE_POKEMON)],
  unstable_cache,
);

export async function getPokemon(
  afterId = 0,
  filters: PokemonFilters = { generations: [], types: [] },
): Promise<PokemonResult<PokemonListPage>> {
  if (!Number.isInteger(afterId) || afterId < 0 || afterId >= POKEMON_MAX_ID) {
    throw new RangeError("Invalid Pokémon page cursor.");
  }

  const filterKey = getPokemonFilterKey(filters);

  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    const normalizedFilters = parsePokemonFilters(
      new URLSearchParams(filterKey),
    );
    const catalog = MOCK_POKEMON.filter(
      (pokemon) =>
        pokemon.id <= POKEMON_MAX_ID &&
        matchesPokemonFilters(pokemon, normalizedFilters),
    );
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
  return cachedPokemonList(afterId, filterKey);
}

export async function getPokemonSearchCatalog(): Promise<
  PokemonResult<PokemonSearchItem[]>
> {
  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    return {
      status: "success",
      data: MOCK_POKEMON.filter(
        ({ id }) => id >= 1 && id <= POKEMON_MAX_ID,
      ).map(({ id, name }) => ({ id, name })),
    };
  }

  return cachedPokemonSearchCatalog();
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
