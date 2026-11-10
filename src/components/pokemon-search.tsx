"use client";

import { SearchIcon, X } from "lucide-react";
import Fuse from "fuse.js/basic";
import { useMemo, useState } from "react";
import type { PokemonSearchItem } from "@/app/types";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Autocomplete,
  Button,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  SearchField,
} from "react-aria-components";

export default function PokemonSearch({
  pokemons,
}: {
  pokemons: PokemonSearchItem[];
}) {
  const [value, setValue] = useState("");
  const normalizedQuery = value.trim().toLowerCase();
  const debouncedQuery = useDebounce(normalizedQuery, 250);
  // Clearing the field restores all entries without waiting for the timer.
  const searchQuery = normalizedQuery === "" ? "" : debouncedQuery;
  const isFiltering = normalizedQuery !== searchQuery;
  const pokemonSearch = useMemo(
    () =>
      new Fuse(pokemons, {
        keys: ["name"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [pokemons],
  );
  const filteredPokemon = useMemo(() => {
    if (searchQuery === "") return pokemons;

    // Fuse wraps each matching Pokémon in a result object with an `item` field.
    return pokemonSearch.search(searchQuery).map(({ item }) => item);
  }, [pokemonSearch, pokemons, searchQuery]);

  const handleClearInput = () => {
    setValue("");
  };

  return (
    <div>
      <h1 className="mb-3 text-5xl">Search</h1>
      <p className="mb-3 text-sm">Search all {pokemons.length} Pokémon.</p>
      <Autocomplete inputValue={value} onInputChange={setValue}>
        <SearchField className="flex flex-col">
          {({ isEmpty }) => (
            <>
              <Label className="mb-1">Find your favorite Pokémon</Label>
              <div className="relative">
                <Input className="w-full rounded-md border p-2" />
                <div className="absolute top-2 right-2 flex">
                  <Button
                    className={isEmpty ? "hidden" : "cursor"}
                    onClick={handleClearInput}
                  >
                    <span className="sr-only">Clear input</span>
                    <X />
                  </Button>
                  <SearchIcon />
                </div>
              </div>
            </>
          )}
        </SearchField>
        <ListBox
          aria-label="Pokémon results list"
          aria-busy={isFiltering}
          items={filteredPokemon}
          renderEmptyState={() =>
            isFiltering ? null : (
              <p>No results found for &quot;{searchQuery}&quot;</p>
            )
          }
        >
          {(pokemon) => (
            <ListBoxItem
              id={pokemon.id}
              textValue={pokemon.name}
              className="data-[focused]:text-pokedex-screen rounded-sm px-2 py-1 data-[focused]:bg-black"
            >
              {pokemon.name}
            </ListBoxItem>
          )}
        </ListBox>
        <p role="status" className="mt-2 text-sm">
          {isFiltering ? "Updating results…" : ""}
        </p>
      </Autocomplete>
    </div>
  );
}
