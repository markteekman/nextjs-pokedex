import type { ReactNode } from "react";

type Props = {
  src: string;
};

export default function PokeCry({ src }: Props): ReactNode {
  return (
    <>
      <p>Cry:</p>
      <audio controls aria-label="Listen to Pokémon cry" src={src}>
        Your browser does not support the audio tag.
      </audio>
    </>
  );
}
