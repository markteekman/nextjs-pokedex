"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePokemonOverview } from "./pokemon-overview-provider";

export function PokemonDetailBackLink() {
  const pathname = usePathname();
  const { snapshot } = usePokemonOverview();
  const overview =
    snapshot?.returnTo && pathname === `/${snapshot.returnTo.id}`
      ? snapshot
      : null;
  const href = overview?.filterKey ? `/?${overview.filterKey}` : "/";

  return (
    <Link href={href} className="pokemon-detail-back">
      <ArrowLeft size={14} aria-hidden="true" />
      {overview ? "Back to results" : "All Pokémon"}
    </Link>
  );
}
