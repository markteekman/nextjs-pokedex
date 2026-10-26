import { gql } from "@apollo/client";
import type { PokemonDetail, PokemonListItem, PokemonTypes } from "@/app/types";
import { query } from "@/lib/apollo-client";
import { MOCK_POKEMON, MOCK_POKEMON_DETAIL } from "@/lib/pokemon.mock";
import { requestPokemon, type PokemonResult } from "@/lib/pokemon-request";

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

interface PokemonForm {
  pokemontypes: PokemonTypeEntry[];
  pokemoncries: PokemonCry[];
  pokemonsprites: PokemonSprites[];
  height: number | null;
  weight: number | null;
}

interface GenerationResponse {
  region: {
    name: string;
  } | null;
}

interface PokemonFlavorText {
  flavor_text: string | null;
}

interface PokemonSpecies {
  id: number;
  name: string;
  pokemons: PokemonForm[];
  generation: GenerationResponse | null;
  pokemonspeciesflavortexts: PokemonFlavorText[] | null;
}

const GET_POKEMON = gql`
  query GetPokemon {
    pokemon: pokemonspecies(limit: 9) {
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
        pokemonsprites {
          sprites
        }
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
    }
  }
`;

function getLatestCry(forms: PokemonForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null;

  return firstForm.pokemoncries[0]?.cries?.latest ?? null;
}

function getSpriteUrl(forms: PokemonForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null;

  return (
    firstForm.pokemonsprites[0]?.sprites?.other["official-artwork"]
      ?.front_default ?? null
  );
}

function getTypeNames(forms: PokemonForm[]): PokemonTypes[] {
  const firstForm = forms[0];

  if (!firstForm) return [];

  return firstForm.pokemontypes.flatMap(({ type }) =>
    type.typenames.map(({ name }) => name),
  );
}

export async function getPokemon(): Promise<PokemonResult<PokemonListItem[]>> {
  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    return { status: "success", data: MOCK_POKEMON };
  }

  const result = await requestPokemon(() =>
    query<{ pokemon: PokemonSpecies[] }>({ query: GET_POKEMON }),
  );

  if (result.status === "unavailable") return result;

  return {
    status: "success",
    data: result.data.pokemon.map(({ id, name, pokemons }) => ({
      id,
      name,
      types: getTypeNames(pokemons),
      spriteUrl: getSpriteUrl(pokemons),
    })),
  };
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

  const result = await requestPokemon(() =>
    query<{ pokemon: PokemonSpecies[] }>({
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
    },
  };
}
