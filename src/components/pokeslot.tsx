import Link from "next/link";
import type { ReactNode } from "react";
import formatDexNumber from "@/utilities/format-dex-number";
import type { PokemonType } from "../app/types";
import PokemonTypeBadge from "./pokemon-type-badge";
import PokeSprite from "./pokesprite";

type Props = {
  id: number;
  name: string;
  types: PokemonType[];
  src: string | null;
  onNavigate?: () => void;
};

export function PokeSlot({
  id,
  name,
  types,
  src,
  onNavigate,
}: Props): ReactNode {
  return (
    <li>
      <Link
        href={`/${id}`}
        prefetch={false}
        onNavigate={onNavigate}
        className="pokeslot relative flex flex-col items-center gap-2 p-3 text-center"
      >
        <span className="pokeslot-number" aria-hidden="true">
          {formatDexNumber(id)}
        </span>
        {src && <PokeSprite src={src} />}
        <p className="leading-none">{name}</p>
        <span className="flex flex-wrap justify-center gap-0.5">
          {types.map((pokemonType) => (
            <PokemonTypeBadge key={pokemonType.id} type={pokemonType} />
          ))}
        </span>
      </Link>
    </li>
  );
}
