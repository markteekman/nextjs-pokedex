import type { ReactNode } from "react";

type Props = {
  id: number;
};

export default function PokeCry({ id }: Props): ReactNode {
  return (
    <>
      <p>Cry:</p>
      <audio
        controls
        aria-label="Listen to Pokémon cry"
        src={`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`}
      >
        Your browser does not support the audio tag.
      </audio>
    </>
  );
}
