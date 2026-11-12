import type { MetadataRoute } from "next";
import { POKEMON_MAX_ID } from "@/lib/pokemon-id";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/search",
    "/filter",
    "/settings",
    ...Array.from({ length: POKEMON_MAX_ID }, (_, index) => `/${index + 1}`),
  ];

  return paths.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
