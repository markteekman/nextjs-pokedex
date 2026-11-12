import Image from "next/image";
import type { ReactNode } from "react";
import type { PokemonType } from "@/lib/pokemon-types";

type Props = {
  type: PokemonType;
  isDetail?: boolean;
};

export default function PokemonTypeBadge({
  type,
  isDetail = false,
}: Props): ReactNode {
  return (
    <span className="pokemon-type-badge block rounded-sm border opacity-90">
      <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/champions/${type.id}.png`}
        width={isDetail ? 100 : 60}
        height={isDetail ? 24 : 14}
        alt={type.name}
      />
      <span className="pokemon-type-label">{type.name}</span>
    </span>
  );
}
