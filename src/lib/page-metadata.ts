import type { Metadata } from "next";

export const POKEDEX_DESCRIPTION =
  "Explore 649 Pokémon in a retro Pokédex, with artwork, types, descriptions, footprints, and cries.";

/** Keep document and social metadata aligned, including the shared preview. */
export function createPageMetadata(
  pageTitle: string,
  description: string,
  pathname?: string,
): Metadata {
  const title = `${pageTitle} | Next.js Pokédex App`;
  const image = {
    url: "/social-preview.png",
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Pokédex App showing Bulbasaur, Ivysaur, and Venusaur on a blue display.",
  };

  return {
    title,
    description,
    ...(pathname ? { alternates: { canonical: pathname } } : {}),
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: "Pokédex App",
      locale: "en_US",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
