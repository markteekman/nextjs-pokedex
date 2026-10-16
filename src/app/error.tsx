"use client";

import { useEffect } from "react";
import { PokedexError } from "@/components/pokedex-error";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Pokédex page failed:", error);
  }, [error]);

  return (
    <PokedexError
      title="Something went wrong"
      description="The Pokédex couldn't display this page. Please try again."
      onReset={reset}
    />
  );
}
