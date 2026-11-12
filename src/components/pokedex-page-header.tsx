import { clsx } from "clsx";
import type { ReactNode } from "react";

type Props = {
  title: string;
  headingId?: string;
  trailing?: ReactNode;
  className?: string;
  as?: "div" | "header";
};

export function PokedexPageHeader({
  title,
  headingId,
  trailing,
  className,
  as: Component = "div",
}: Props) {
  return (
    <Component className={clsx("pokedex-index-header", className)}>
      <h1 id={headingId} className="text-xl">
        {title}
      </h1>
      {trailing != null && <p className="pokedex-index-count">{trailing}</p>}
    </Component>
  );
}
