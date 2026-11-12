import type { ReactNode } from "react";
import { Header } from "./header";

type Props = {
  children: ReactNode;
};

export function PokedexCase({ children }: Props): ReactNode {
  return (
    <div className="pokedex relative mx-auto my-1 rounded-4xl">
      <Header />
      <div className="under-plate relative z-10 mb-8 grid grid-cols-1 py-8">
        {children}
      </div>
    </div>
  );
}
