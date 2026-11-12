import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata(
  "Settings",
  "Adjust Pokémon animations, cry autoplay, and screen contrast in your Pokédex.",
  "/settings",
);

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
