import type { PokemonDetail, PokemonListItem } from "@/app/types";

export const MOCK_POKEMON = [
  {
    id: 1,
    name: "Bulbasaur",
    types: [
      { id: 12, name: "Grass" },
      { id: 4, name: "Poison" },
    ],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  },
  {
    id: 2,
    name: "Ivysaur",
    types: [
      { id: 12, name: "Grass" },
      { id: 4, name: "Poison" },
    ],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
  },
  {
    id: 3,
    name: "Venusaur",
    types: [
      { id: 12, name: "Grass" },
      { id: 4, name: "Poison" },
    ],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
  },
  {
    id: 4,
    name: "Charmander",
    types: [{ id: 10, name: "Fire" }],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  },
  {
    id: 5,
    name: "Charmeleon",
    types: [{ id: 10, name: "Fire" }],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
  },
  {
    id: 6,
    name: "Charizard",
    types: [
      { id: 10, name: "Fire" },
      { id: 3, name: "Flying" },
    ],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    id: 7,
    name: "Squirtle",
    types: [{ id: 11, name: "Water" }],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
  },
  {
    id: 8,
    name: "Wartortle",
    types: [{ id: 11, name: "Water" }],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png",
  },
  {
    id: 9,
    name: "Blastoise",
    types: [{ id: 11, name: "Water" }],
    spriteUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
  },
] satisfies PokemonListItem[];

export const MOCK_POKEMON_DETAIL = {
  id: 1,
  name: "Bulbasaur",
  types: [
    { id: 12, name: "Grass" },
    { id: 4, name: "Poison" },
  ],
  cryUrl:
    "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg",
  spriteUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  height: 7,
  weight: 69,
  region: "kanto",
  flavorText:
    "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.",
  genus: "Seed Pokémon",
} satisfies PokemonDetail;
