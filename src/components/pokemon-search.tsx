"use client";

import { SearchIcon, X } from "lucide-react";
import Fuse from "fuse.js/basic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PokemonSearchItem } from "@/app/types";
import { useDebounce } from "@/hooks/use-debounce";
import formatDexNumber from "@/utilities/format-dex-number";
import {
  Autocomplete,
  Button,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  SearchField,
  Text,
} from "react-aria-components";

export default function PokemonSearch({
  pokemons,
}: {
  pokemons: PokemonSearchItem[];
}) {
  const [value, setValue] = useState("");
  const normalizedQuery = value.trim().toLowerCase();
  const debouncedQuery = useDebounce(normalizedQuery, 250);
  const hasQuery = normalizedQuery.length > 0;
  // Clearing hides suggestions immediately, even before the debounce settles.
  const searchQuery = hasQuery ? debouncedQuery : "";
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
    if (searchQuery === "") return [];

    // Fuse wraps each matching Pokémon in a result object with an `item` field.
    return pokemonSearch.search(searchQuery).map(({ item }) => item);
  }, [pokemonSearch, searchQuery]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h1 className="mb-3 shrink-0 text-5xl">Search</h1>
      <p className="mb-3 shrink-0 text-sm">
        Search all {pokemons.length} Pokémon.
      </p>
      <Autocomplete inputValue={value} onInputChange={setValue}>
        <SearchField className="flex shrink-0 flex-col">
          {({ isEmpty }) => (
            <>
              <Label className="mb-1">Find your favorite Pokémon</Label>
              <div className="relative">
                <Input className="min-h-11 w-full rounded-md border p-2 pe-20 outline-offset-2" />
                <div className="absolute inset-y-0 end-2 flex items-center gap-2">
                  <Button
                    className={
                      isEmpty
                        ? "hidden"
                        : "grid h-8 w-8 cursor-pointer place-items-center rounded-sm outline-offset-2"
                    }
                  >
                    <span className="sr-only">Clear input</span>
                    <X size={18} aria-hidden="true" />
                  </Button>
                  <SearchIcon size={18} aria-hidden="true" />
                </div>
              </div>
            </>
          )}
        </SearchField>
        {hasQuery && (
          <ListBox
            aria-label="Pokémon results list"
            aria-busy={isFiltering}
            items={filteredPokemon}
            className="mt-3 min-h-0 shrink [scrollbar-gutter:stable] overflow-y-auto overscroll-contain rounded-md border border-current/30 p-1"
            renderEmptyState={() =>
              isFiltering ? null : (
                <p className="p-2">
                  No results found for &quot;{searchQuery}&quot;
                </p>
              )
            }
          >
            {(pokemon) => (
              <ListBoxItem
                id={pokemon.id}
                textValue={pokemon.name}
                href={`/${pokemon.id}`}
                render={(domProps) =>
                  "href" in domProps ? (
                    <Link {...domProps} prefetch={false} />
                  ) : (
                    <div {...domProps} />
                  )
                }
                className="data-[focused]:text-pokedex-screen data-[hovered]:text-pokedex-screen flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-sm px-3 py-2 outline-offset-[-2px] data-[focused]:bg-black data-[hovered]:bg-black"
              >
                <Text slot="label" className="min-w-0 break-words uppercase">
                  {pokemon.name}
                </Text>
                <Text slot="description" className="shrink-0 tabular-nums">
                  <span className="sr-only">National Pokédex entry </span>
                  {formatDexNumber(pokemon.id)}
                </Text>
              </ListBoxItem>
            )}
          </ListBox>
        )}
        <p role="status" className="mt-2 shrink-0 text-sm">
          {isFiltering ? "Updating results…" : ""}
        </p>
      </Autocomplete>
    </div>
  );
}
