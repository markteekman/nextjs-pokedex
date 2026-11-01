"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PokemonListPage } from "@/app/types";
import { PokeSlot } from "./pokeslot";
import {
  usePokemonOverview,
  type OverviewSnapshot,
} from "./pokemon-overview-provider";

export default function PokemonIndex({
  initialPage,
}: {
  initialPage: PokemonListPage;
}) {
  const { snapshot: savedOverview, saveSnapshot } = usePokemonOverview();
  const [overview, setOverview] = useState<OverviewSnapshot>(() =>
    savedOverview?.page.total === initialPage.total
      ? savedOverview
      : { page: initialPage, returnTo: null },
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");
  const gridRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLParagraphElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const returnToRef = useRef(overview.returnTo);
  const focusNewIdRef = useRef<number | "end" | null>(null);
  const { page } = overview;

  useEffect(() => () => requestRef.current?.abort(), []);

  useLayoutEffect(() => {
    const returnTo = returnToRef.current;
    const targetId = focusNewIdRef.current ?? returnTo?.id;
    if (targetId == null) return;

    // Restore after Next.js has applied its own route scroll handling.
    const frame = requestAnimationFrame(() => {
      const link = gridRef.current?.querySelector<HTMLAnchorElement>(
        `a[href="/${targetId}"]`,
      );
      const screen = gridRef.current?.closest(".pokedex-screen-content");
      if (returnTo && screen) screen.scrollTop = returnTo.scrollTop;

      if (targetId === "end") {
        endRef.current?.focus();
      } else {
        link?.focus({ preventScroll: true });
        if (!returnTo)
          link?.scrollIntoView({ block: "nearest", behavior: "instant" });
      }

      returnToRef.current = null;
      focusNewIdRef.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function rememberPosition(id: number) {
    saveSnapshot({
      page,
      returnTo: {
        id,
        scrollTop:
          gridRef.current?.closest(".pokedex-screen-content")?.scrollTop ?? 0,
      },
    });
  }

  async function loadMore() {
    if (requestRef.current || page.nextCursor === null) return;

    const controller = new AbortController();
    requestRef.current = controller;
    setIsLoading(true);
    setHasError(false);
    setMessage("Loading more Pokémon…");

    try {
      const response = await fetch(`/api/pokemon?after=${page.nextCursor}`, {
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(15_000),
        ]),
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error(`Pokémon page failed: ${response.status}`);
      const batch: PokemonListPage = await response.json();
      if (controller.signal.aborted) return;

      const updated: PokemonListPage = {
        ...batch,
        pokemons: [...page.pokemons, ...batch.pokemons],
      };
      if (document.activeElement === buttonRef.current) {
        focusNewIdRef.current = batch.pokemons[0]?.id ?? "end";
      }
      const snapshot = { page: updated, returnTo: null };
      saveSnapshot(snapshot);
      setOverview(snapshot);
      setMessage(
        `${batch.pokemons.length} Pokémon added. Showing ${updated.pokemons.length} of ${updated.total}.`,
      );
    } catch {
      if (!controller.signal.aborted) {
        setHasError(true);
        setMessage(
          "Couldn't load more Pokémon. Your existing entries are still available. Try again.",
        );
      }
    } finally {
      requestRef.current = null;
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }

  return (
    <div className="pokedex-index">
      <div className="pokedex-index-header">
        <h1 className="text-xl">National Pokédex</h1>
        <p className="pokedex-index-count">
          {String(page.pokemons.length).padStart(3, "0")} / {page.total} entries
        </p>
      </div>
      <ul
        id="pokemon-list"
        ref={gridRef}
        className="pokedex-grid grid grid-cols-2 lg:grid-cols-3"
        aria-busy={isLoading}
      >
        {page.pokemons.map((pokemon) => (
          <PokeSlot
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            src={pokemon.spriteUrl}
            onNavigate={() => rememberPosition(pokemon.id)}
          />
        ))}
      </ul>
      <div className="pokedex-pagination">
        {page.nextCursor !== null ? (
          <button
            ref={buttonRef}
            type="button"
            className="pokedex-load-more"
            aria-controls="pokemon-list"
            aria-disabled={isLoading}
            onClick={loadMore}
          >
            {isLoading
              ? "Loading Pokémon…"
              : hasError
                ? "Try again"
                : "Load more Pokémon"}
          </button>
        ) : (
          <p ref={endRef} tabIndex={-1} className="pokedex-pagination-end">
            All {page.pokemons.length} Pokémon loaded.
          </p>
        )}
        <p className="pokedex-load-status" role="status" aria-atomic="true">
          {message}
        </p>
        {page.nextCursor !== null && (
          <noscript>Enable JavaScript to load more Pokémon.</noscript>
        )}
      </div>
    </div>
  );
}
