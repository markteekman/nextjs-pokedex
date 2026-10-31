import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PokedexScreen({ children }: Props): ReactNode {
  return (
    <div className="pokedex-screen bg-pokedex-screen relative isolate h-full overflow-hidden rounded-md text-black">
      <div className="pokedex-screen-content scrollbar-thumb-pokedex-screen h-128 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
