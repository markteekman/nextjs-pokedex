import type { PokemonDetail, PokemonListItem } from "@/app/types";

export const MOCK_POKEMON = [
  { id: 1, name: "bulbasaur", types: ["Grass", "Poison"] },
  { id: 2, name: "ivysaur", types: ["Grass", "Poison"] },
  { id: 3, name: "venusaur", types: ["Grass", "Poison"] },
  { id: 4, name: "charmander", types: ["Fire"] },
  { id: 5, name: "charmeleon", types: ["Fire"] },
  { id: 6, name: "charizard", types: ["Fire", "Flying"] },
  { id: 7, name: "squirtle", types: ["Water"] },
  { id: 8, name: "wartortle", types: ["Water"] },
  { id: 9, name: "blastoise", types: ["Water"] },
] satisfies PokemonListItem[];

export const MOCK_POKEMON_DETAIL = {
  id: 1,
  name: "bulbasaur",
  types: ["Grass", "Poison"],
  cries: "latest",
  region: "kanto",
} satisfies PokemonDetail;
