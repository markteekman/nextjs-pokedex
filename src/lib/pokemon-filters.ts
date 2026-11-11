import type { PokemonListItem, PokemonType } from "@/app/types";

export const GENERATION_OPTIONS = [
  { id: 1, label: "Generation I", firstId: 1, lastId: 151 },
  { id: 2, label: "Generation II", firstId: 152, lastId: 251 },
  { id: 3, label: "Generation III", firstId: 252, lastId: 386 },
  { id: 4, label: "Generation IV", firstId: 387, lastId: 493 },
  { id: 5, label: "Generation V", firstId: 494, lastId: 649 },
] as const;

export const TYPE_OPTIONS = [
  { id: 1, name: "Normal", value: "normal" },
  { id: 2, name: "Fighting", value: "fighting" },
  { id: 3, name: "Flying", value: "flying" },
  { id: 4, name: "Poison", value: "poison" },
  { id: 5, name: "Ground", value: "ground" },
  { id: 6, name: "Rock", value: "rock" },
  { id: 7, name: "Bug", value: "bug" },
  { id: 8, name: "Ghost", value: "ghost" },
  { id: 9, name: "Steel", value: "steel" },
  { id: 10, name: "Fire", value: "fire" },
  { id: 11, name: "Water", value: "water" },
  { id: 12, name: "Grass", value: "grass" },
  { id: 13, name: "Electric", value: "electric" },
  { id: 14, name: "Psychic", value: "psychic" },
  { id: 15, name: "Ice", value: "ice" },
  { id: 16, name: "Dragon", value: "dragon" },
  { id: 17, name: "Dark", value: "dark" },
  { id: 18, name: "Fairy", value: "fairy" },
] as const satisfies readonly (PokemonType & { value: string })[];

export type PokemonTypeFilter = (typeof TYPE_OPTIONS)[number]["value"];

export type PokemonFilters = {
  generations: number[];
  types: PokemonTypeFilter[];
};

export type PokemonFilterSearchParams = Record<
  string,
  string | string[] | undefined
>;

/** Keep one validated order for URLs, cache keys, and saved overview state. */
export function parsePokemonFilters(
  params: URLSearchParams | PokemonFilterSearchParams,
): PokemonFilters {
  function values(key: string): string[] {
    if (params instanceof URLSearchParams) return params.getAll(key);
    const value = params[key];
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  const generations = values("generation");
  const types = values("type");

  return {
    generations: GENERATION_OPTIONS.filter(({ id }) =>
      generations.includes(String(id)),
    ).map(({ id }) => id),
    types: TYPE_OPTIONS.filter(({ value }) => types.includes(value)).map(
      ({ value }) => value,
    ),
  };
}

export function getPokemonFilterKey(filters: PokemonFilters): string {
  const params = new URLSearchParams();
  for (const { id } of GENERATION_OPTIONS) {
    if (filters.generations.includes(id))
      params.append("generation", String(id));
  }
  for (const { value } of TYPE_OPTIONS) {
    if (filters.types.includes(value)) params.append("type", value);
  }
  return params.toString();
}

export function getPokemonFilterHref(
  filters: PokemonFilters,
  pathname = "/",
): string {
  const query = getPokemonFilterKey(filters);
  return query ? `${pathname}?${query}` : pathname;
}

export function hasPokemonFilters(filters: PokemonFilters): boolean {
  return filters.generations.length > 0 || filters.types.length > 0;
}

export function getPokemonFilterSummary(filters: PokemonFilters): string {
  const generations = GENERATION_OPTIONS.filter(({ id }) =>
    filters.generations.includes(id),
  ).map(({ label }) => label);
  const types = TYPE_OPTIONS.filter(({ value }) =>
    filters.types.includes(value),
  ).map(({ name }) => name);
  return [generations.join(" or "), types.join(" or ")]
    .filter(Boolean)
    .join(" · ");
}

/** Each group matches any selection; the groups both constrain the species. */
export function getPokemonFilterConditions(filters: PokemonFilters) {
  const typeIds = TYPE_OPTIONS.filter(({ value }) =>
    filters.types.includes(value),
  ).map(({ id }) => id);

  return {
    ...(filters.generations.length > 0
      ? { generation_id: { _in: filters.generations } }
      : {}),
    ...(typeIds.length > 0
      ? {
          pokemons: {
            is_default: { _eq: true },
            pokemontypes: { type_id: { _in: typeIds } },
          },
        }
      : {}),
  };
}

/** The offline fixture follows the same rules as the live species query. */
export function matchesPokemonFilters(
  pokemon: Pick<PokemonListItem, "id" | "types">,
  filters: PokemonFilters,
): boolean {
  const matchesGeneration =
    filters.generations.length === 0 ||
    GENERATION_OPTIONS.some(
      ({ id, firstId, lastId }) =>
        filters.generations.includes(id) &&
        pokemon.id >= firstId &&
        pokemon.id <= lastId,
    );
  const matchesType =
    filters.types.length === 0 ||
    TYPE_OPTIONS.some(
      ({ id, value }) =>
        filters.types.includes(value) &&
        pokemon.types.some((type) => type.id === id),
    );

  return matchesGeneration && matchesType;
}
