"use client";

import Image from "next/image";
import { useState } from "react";
import { usePokedexPreferences } from "@/hooks/use-pokedex-preferences";

type Props = {
  src: string;
  alt: string;
  preload: boolean;
};

export default function PokemonDetailSprite({ src, alt, preload }: Props) {
  const { ready, reduceMotion } = usePokedexPreferences();
  const [loaded, setLoaded] = useState(false);
  const [hasBounced, setHasBounced] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      width={224}
      height={224}
      sizes="(max-width: 600px) 160px, 224px"
      className="pokemon-detail-artwork"
      preload={preload}
      data-entrance={
        ready && loaded && !reduceMotion && !hasBounced ? "bounce" : undefined
      }
      onLoad={() => setLoaded(true)}
      onAnimationEnd={(event) => {
        if (event.animationName === "pokemon-detail-bounce")
          setHasBounced(true);
      }}
    />
  );
}
