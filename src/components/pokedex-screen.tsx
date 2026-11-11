"use client";

import type { ReactNode } from "react";
import { usePokedexPreferences } from "@/hooks/use-pokedex-preferences";

type Props = {
  children: ReactNode;
};

export function PokedexScreen({ children }: Props): ReactNode {
  const { enhanceContrast } = usePokedexPreferences();

  return (
    <div
      className="pokedex-screen bg-pokedex-screen relative isolate h-full overflow-hidden rounded-md text-black"
      data-contrast={enhanceContrast ? "enhanced" : undefined}
    >
      <div className="pokedex-screen-content scrollbar-thumb-pokedex-screen h-128 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
