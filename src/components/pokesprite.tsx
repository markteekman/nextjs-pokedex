import Image from "next/image";
import type { ReactNode } from "react";

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
  const isDetail = variant === "detail";

  return (
    <Image
      src={src}
      alt={alt}
      width={isDetail ? 224 : 88}
      height={isDetail ? 224 : 88}
      sizes={isDetail ? "(max-width: 600px) 160px, 224px" : "88px"}
      className={isDetail ? "pokemon-detail-artwork" : "pokeslot-image"}
      preload={preload}
    />
  );
}
