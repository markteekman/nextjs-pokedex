import Link from "next/link";
import type { ReactNode } from "react";
import type { PokemonTypes } from "../app/types";
import PokemonTypeBadge from "./pokemon-type-badge";
import PokeSprite from "./pokesprite";
import formatDexNumber from "@/utilities/format-dex-number";

type Props = {
  id: number;
  name: string;
  types: PokemonTypes[];
};

export function PokeSlot({ id, name, types }: Props): ReactNode {
  return (
    <li>
      <Link
        href={`/${id}`}
        className="pokeslot relative flex flex-col items-center gap-2 p-3 text-center"
      >
        <span className="pokeslot-number" aria-hidden="true">
          {formatDexNumber(id)}
        </span>
        <PokeSprite id={id} />
        <p className="leading-none first-letter:uppercase">{name}</p>
        <span className="flex flex-wrap justify-center gap-1">
          {types.map((pokemonType) => (
            <PokemonTypeBadge key={pokemonType} variant={pokemonType}>
              {pokemonType}
            </PokemonTypeBadge>
          ))}
        </span>
      </Link>
    </li>
  );
}
