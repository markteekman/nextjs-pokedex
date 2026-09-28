/**
 * Represents the various types a Pokémon can have.
 */
export type PokemonTypes =
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
 * Represents a Pokémon in a list.
 */
export interface PokemonListItem {
  id: number;
  name: string;
  types: PokemonTypes[];
}

/**
 * Represents detailed information about a Pokémon.
 */
export interface PokemonDetail extends PokemonListItem {
  cryUrl: string | null;
  region: string | null;
}
