"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PokemonListPage } from "@/app/types";

export type OverviewSnapshot = {
  page: PokemonListPage;
  returnTo: { id: number; scrollTop: number } | null;
};

const OverviewContext = createContext<{
  snapshot: OverviewSnapshot | null;
  saveSnapshot: (snapshot: OverviewSnapshot) => void;
} | null>(null);

// The shared layout keeps this state alive during client-side navigation.
export function PokemonOverviewProvider({ children }: { children: ReactNode }) {
  const [snapshot, saveSnapshot] = useState<OverviewSnapshot | null>(null);

  return (
    <OverviewContext value={{ snapshot, saveSnapshot }}>
      {children}
    </OverviewContext>
  );
}

export function usePokemonOverview() {
  const context = useContext(OverviewContext);
  if (!context) throw new Error("Pokémon overview provider is missing.");
  return context;
}
