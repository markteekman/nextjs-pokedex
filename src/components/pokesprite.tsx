import Image from "next/image";
import type { ReactNode } from "react";
import PokemonDetailSprite from "./pokemon-detail-sprite";

type Props = {
  src: string;
  alt?: string;
  variant?: "slot" | "detail";
  preload?: boolean;
};

export default function PokeSprite({
  src,
  alt = "",
  variant = "slot",
  preload = false,
}: Props): ReactNode {
  if (variant === "detail") {
    return (
      <PokemonDetailSprite key={src} src={src} alt={alt} preload={preload} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={88}
      height={88}
      sizes="88px"
      className="pokeslot-image"
      preload={preload}
    />
  );
}
