import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  src: string;
};

export default function PokeSprite({ src }: Props): ReactNode {
  return (
    <Image src={src} alt="" width={88} height={88} className="pokeslot-image" />
  );
}
