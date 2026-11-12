"use client";

import Fuse from "fuse.js/basic";
import { ChevronRight, SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import type { PokemonSearchItem } from "@/app/types";
import { PokedexPageHeader } from "@/components/pokedex-page-header";
import { useDebounce } from "@/hooks/use-debounce";
import formatDexNumber from "@/utilities/format-dex-number";

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
    <div className="pokemon-search flex h-full min-h-0 flex-col">
      <PokedexPageHeader
        title="Search"
        className="shrink-0"
        trailing={
          <>
            {pokemons.length} {pokemons.length === 1 ? "entry" : "entries"}
          </>
        }
      />
      <Autocomplete inputValue={value} onInputChange={setValue}>
        <SearchField className="pokemon-search-field">
          {({ isEmpty }) => (
            <>
              <Label className="pokemon-search-label">
                Find your favorite Pokémon
              </Label>
              <div className="pokemon-search-input-wrap">
                <SearchIcon size={18} aria-hidden="true" />
                <Input
                  className="pokemon-search-input"
                  placeholder="e.g. Bulbasaur"
                />
                <Button
                  className={
                    isEmpty
                      ? "pokemon-search-clear invisible"
                      : "pokemon-search-clear"
                  }
                >
                  <span className="sr-only">Clear input</span>
                  <X size={18} aria-hidden="true" />
                </Button>
              </div>
            </>
          )}
        </SearchField>
        {hasQuery && (
          <ListBox
            aria-label="Pokémon results list"
            aria-busy={isFiltering}
            items={filteredPokemon}
            className="pokemon-search-results"
            renderEmptyState={() =>
              isFiltering ? null : (
                <p className="pokemon-search-empty">
                  No results found for &quot;{searchQuery}&quot;. Try another
                  name.
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
                className="pokemon-search-result"
              >
                <ChevronRight
                  size={14}
                  className="pokemon-search-selection"
                  aria-hidden="true"
                />
                <Text slot="label" className="pokemon-search-name">
                  {pokemon.name}
                </Text>
                <Text slot="description" className="pokemon-search-number">
                  <span className="sr-only">National Pokédex entry </span>
                  {formatDexNumber(pokemon.id)}
                </Text>
              </ListBoxItem>
            )}
          </ListBox>
        )}
        {!hasQuery && (
          <p className="pokemon-search-hint">Start typing a Pokémon name.</p>
        )}
        <p role="status" className="pokemon-search-status">
          {isFiltering
            ? "Updating results…"
            : hasQuery && filteredPokemon.length > 0
              ? `${filteredPokemon.length} matching Pokémon`
              : ""}
        </p>
      </Autocomplete>
    </div>
  );
}
