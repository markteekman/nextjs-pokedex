"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import { Header } from "./header";

type Props = {
  children: ReactNode;
};

export function PokedexCase({ children }: Props): ReactNode {
  const lightsOn = true;

  return (
    <div
      className={clsx(
        "pokedex relative mx-auto my-1 rounded-4xl",
        lightsOn && "pokedex--lights-on",
      )}
    >
      <Header />
      <div className="under-plate relative z-10 mb-8 grid grid-cols-1 py-8">
        {children}
      </div>
    </div>
  );
}
