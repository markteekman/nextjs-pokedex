/**
 * Represents the English display name of a Pokémon type.
 */
export type PokemonTypeName =
  | "Bug"
  | "Dark"
  | "Dragon"
  | "Electric"
  | "Fairy"
  | "Fighting"
  | "Fire"
  | "Flying"
  | "Ghost"
  | "Grass"
  | "Ground"
  | "Ice"
  | "Normal"
  | "Poison"
  | "Psychic"
  | "Rock"
  | "Steel"
  | "Water";

/**
 * Represents a single Pokemon type.
 */
export interface PokemonType {
  id: number;
  name: PokemonTypeName;
}

/**
 * Represents a Pokémon in a list.
 */
export interface PokemonListItem {
  id: number;
  /** English display name, including official punctuation and symbols. */
  name: string;
  types: PokemonType[];
  spriteUrl: string | null;
}

export type PokemonSearchItem = Pick<PokemonListItem, "id" | "name">;

export interface PokemonListPage {
  pokemons: PokemonListItem[];
  nextCursor: number | null;
  total: number;
}

/**
 * Represents detailed information about a Pokémon.
 */
export interface PokemonDetail extends PokemonListItem {
  cryUrl: string | null;
  height: number | null;
  weight: number | null;
  region: string | null;
  flavorText: string | null;
  genus: string | null;
}
