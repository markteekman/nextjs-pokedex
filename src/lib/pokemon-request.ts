import { ServerError, ServerParseError } from "@apollo/client/errors";

export type PokemonResult<T> =
  | { status: "success"; data: T }
  | { status: "unavailable" };

class PokemonNetworkError extends Error {
  constructor(cause: unknown) {
    super("Could not connect to the Pokémon API.", { cause });
    this.name = "PokemonNetworkError";
  }
}

/** Bound the wait and keep transport failures distinct from application bugs. */
export const fetchPokemonApi: typeof fetch = async (input, options) => {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.POKEAPI_SIMULATE_ERROR === "true"
  ) {
    throw new PokemonNetworkError(new Error("Simulated Pokémon API outage."));
  }

  const timeout = AbortSignal.timeout(10_000);
  const requestSignal =
    options?.signal ?? (input instanceof Request ? input.signal : undefined);
  const signal = requestSignal
    ? AbortSignal.any([requestSignal, timeout])
    : timeout;

  try {
    // Retry should make a fresh request, rather than reuse a cached response.
    return await fetch(input, { ...options, signal, cache: "no-store" });
  } catch (error) {
    // Next.js can throw during fetch to opt a route into dynamic rendering.
    // Preserve those control-flow exceptions and other unexpected failures.
    if (error instanceof TypeError || signal.aborted) {
      throw new PokemonNetworkError(error);
    }
    throw error;
  }
};

/** Only recognized request failures become a recoverable result. */
export async function requestPokemon<T>(
  request: () => Promise<{ data?: T }>,
): Promise<PokemonResult<T>> {
  let response: { data?: T };

  try {
    response = await request();
  } catch (error) {
    const isUnavailable =
      error instanceof PokemonNetworkError ||
      ServerParseError.is(error) ||
      (ServerError.is(error) &&
        (error.statusCode >= 500 ||
          error.statusCode === 408 ||
          error.statusCode === 429));

    if (!isUnavailable) throw error;

    console.error("Pokémon API request failed:", error);
    return { status: "unavailable" };
  }

  if (!response.data) {
    throw new Error("The Pokémon API returned no data.");
  }

  return { status: "success", data: response.data };
}
