import type { PokemonResult } from "./pokemon-request";

export const POKEMON_CACHE_REVALIDATE_SECONDS = 60 * 60 * 24;

type CacheFactory = <Args extends unknown[], Data>(
  load: (...args: Args) => Promise<Data>,
  keyParts: string[],
  options: { revalidate: number; tags: string[] },
) => (...args: Args) => Promise<Data>;

class PokemonUnavailableForCache extends Error {
  constructor() {
    super("Pokémon data is unavailable; do not cache this result.");
    this.name = "PokemonUnavailableForCache";
  }
}

/** Cache normalized successes, while keeping temporary failures retryable. */
export function createCachedPokemonRequest<Args extends unknown[], Data>(
  request: (...args: Args) => Promise<PokemonResult<Data>>,
  keyParts: string[],
  cache: CacheFactory,
): (...args: Args) => Promise<PokemonResult<Data>> {
  const cached = cache(
    async (...args: Args) => {
      const result = await request(...args);
      // A returned failure object would be cached as ordinary successful data.
      if (result.status === "unavailable")
        throw new PokemonUnavailableForCache();
      return result.data;
    },
    keyParts,
    { revalidate: POKEMON_CACHE_REVALIDATE_SECONDS, tags: ["pokemon"] },
  );

  return async (...args: Args) => {
    // Keep the existing outage preview meaningful even with a warm cache.
    if (
      process.env.NODE_ENV === "development" &&
      process.env.POKEAPI_SIMULATE_ERROR === "true"
    ) {
      return request(...args);
    }

    try {
      return { status: "success", data: await cached(...args) };
    } catch (error) {
      if (error instanceof PokemonUnavailableForCache)
        return { status: "unavailable" };
      throw error;
    }
  };
}
