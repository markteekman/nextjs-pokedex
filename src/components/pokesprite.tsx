import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt?: string;
  preload?: boolean;
};

export default function PokeSprite({
  src,
  alt = "",
  preload = false,
}: Props): ReactNode {
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
