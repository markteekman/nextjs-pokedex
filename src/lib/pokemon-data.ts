import { gql } from "@apollo/client";
import type { PokemonDetail, PokemonListItem, PokemonTypes } from "@/app/types";
import { query } from "@/lib/apollo-client";
import { MOCK_POKEMON, MOCK_POKEMON_DETAIL } from "@/lib/pokemon.mock";

interface CryUrls {
  latest: string | null;
  legacy: string | null;
}

interface PokemonCry {
  cries: CryUrls | null;
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
  pokemoncries: PokemonCry[];
  pokemontypes: PokemonTypeEntry[];
}

interface GenerationResponse {
  region: {
    name: string;
  } | null;
}

interface PokemonSpecies {
  id: number;
  name: string;
  pokemons: PokemonForm[];
  generation: GenerationResponse | null;
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
      }
      generation {
        region {
          name
        }
      }
    }
  }
`;

function getLatestCry(forms: PokemonForm[]): string | null {
  const firstForm = forms[0];

  if (!firstForm) return null


  return firstForm.pokemoncries[0]?.cries?.latest ?? null;
}

function getTypeNames(forms: PokemonForm[]): PokemonTypes[] {
  const firstForm = forms[0];

  if (!firstForm) return [];

  return firstForm.pokemontypes.flatMap(({ type }) =>
    type.typenames.map(({ name }) => name),
  );
}

export async function getPokemon(): Promise<PokemonListItem[]> {
  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    return MOCK_POKEMON;
  }

  const { data } = await query<{ pokemon: PokemonSpecies[] }>({
    query: GET_POKEMON,
  });

  if (!data) return [];

  return data.pokemon.map(({ id, name, pokemons }) => ({
    id,
    name,
    types: getTypeNames(pokemons),
  }));
}

export async function getSinglePokemon(
  id: number,
): Promise<PokemonDetail | null> {
  if (process.env.POKEAPI_DATA_SOURCE === "mock") {
    return MOCK_POKEMON_DETAIL;
  }

  const { data } = await query<{ pokemon: PokemonSpecies[] }>({
    query: GET_SINGLE_POKEMON,
    variables: { id },
  });

  if (!data) return null;

  const firstResult = data.pokemon[0];

  if (!firstResult) return null;

  return {
    id: firstResult.id,
    name: firstResult.name,
    types: getTypeNames(firstResult.pokemons),
    cryUrl: getLatestCry(firstResult.pokemons),
    region: firstResult.generation?.region?.name ?? null,
  };
}
