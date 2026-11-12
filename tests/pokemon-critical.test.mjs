import assert from "node:assert/strict";
import test from "node:test";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { createCachedPokemonRequest } from "../src/lib/pokemon-cache.ts";
import {
  getPokemonFilterHref,
  getPokemonFilterKey,
  parsePokemonFilters,
} from "../src/lib/pokemon-filters.ts";
import { fetchPokemonApi, requestPokemon } from "../src/lib/pokemon-request.ts";

// Stand in for Next's persistent cache: save fulfilled values, not rejections.
// These tests exercise our cache boundary, not Next's storage or revalidation.
function memoryCache(load) {
  const entries = new Map();
  return async (...args) => {
    const key = JSON.stringify(args);
    if (!entries.has(key)) entries.set(key, await load(...args));
    return entries.get(key);
  };
}

test("filters discard unknown values and share one canonical URL/cache key", () => {
  const filters = parsePokemonFilters({
    generation: ["5", "1", "5", "99"],
    type: ["water", "fire", "water", "unknown"],
  });
  assert.deepEqual(filters, {
    generations: [1, 5],
    types: ["fire", "water"],
  });
  const key = "generation=1&generation=5&type=fire&type=water";
  assert.equal(getPokemonFilterKey(filters), key);
  assert.equal(getPokemonFilterHref(filters), `/?${key}`);
  assert.deepEqual(parsePokemonFilters(new URLSearchParams(key)), filters);
  assert.equal(getPokemonFilterHref(parsePokemonFilters({})), "/");
});

test("successful cache results are reused without mixing Pokémon IDs", async (t) => {
  const request = t.mock.fn(async (id) => ({
    status: "success",
    data: { id },
  }));
  const load = createCachedPokemonRequest(request, ["detail"], memoryCache);

  assert.deepEqual(await load(1), { status: "success", data: { id: 1 } });
  assert.deepEqual(await load(2), { status: "success", data: { id: 2 } });
  assert.deepEqual(await load(1), { status: "success", data: { id: 1 } });
  assert.equal(request.mock.callCount(), 2);
});

test("an unavailable cache result can recover and the recovered data is reused", async (t) => {
  let available = false;
  const request = t.mock.fn(async () =>
    available ? { status: "success", data: [] } : { status: "unavailable" },
  );
  const load = createCachedPokemonRequest(request, ["overview"], memoryCache);

  assert.deepEqual(await load(), { status: "unavailable" });
  available = true;
  assert.deepEqual(await load(), { status: "success", data: [] });
  assert.deepEqual(await load(), { status: "success", data: [] });
  assert.equal(request.mock.callCount(), 2);
});

test("request handling recovers from outages but preserves application errors", async (t) => {
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("Connection failed");
  });

  assert.deepEqual(
    await requestPokemon(() => fetchPokemonApi("https://example.invalid")),
    { status: "unavailable" },
  );
  for (const status of [408, 429, 503]) {
    const error = new ServerError("Service unavailable", {
      response: new Response(null, { status }),
      bodyText: "",
    });
    assert.deepEqual(
      await requestPokemon(async () => {
        throw error;
      }),
      { status: "unavailable" },
    );
  }

  for (const error of [
    new Error("Application bug"),
    new CombinedGraphQLErrors({ errors: [{ message: "Invalid query" }] }),
  ]) {
    await assert.rejects(
      requestPokemon(async () => {
        throw error;
      }),
      (caught) => caught === error,
    );
  }
});
