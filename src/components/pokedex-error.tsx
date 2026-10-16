"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Unplug } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onReset?: () => void;
};

export function PokedexError({
  title = "Couldn't load Pokémon",
  description = "The Pokémon data service is unavailable right now. Please try again in a moment.",
  onReset,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      router.refresh();
      onReset?.();
    });
  }

  return (
    <div className="pokedex-error">
      <Unplug aria-hidden="true" size={40} strokeWidth={1.5} />
      <h1 className="text-2xl">{title}</h1>
      <p className="pokedex-error-description">{description}</p>
      <button
        type="button"
        className="pokedex-retry-button"
        onClick={retry}
        disabled={isPending}
      >
        Try again
      </button>
      <p className="pokedex-retry-status" role="status">
        {isPending ? "Trying to reconnect…" : ""}
      </p>
    </div>
  );
}
