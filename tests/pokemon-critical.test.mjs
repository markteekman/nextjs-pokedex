import assert from "node:assert/strict";
import test from "node:test";
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { createCachedPokemonRequest } from "../src/lib/pokemon-cache.ts";
import { parsePokemonId } from "../src/lib/pokemon-id.ts";
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

test("detail IDs accept catalog boundaries and reject invalid or noncanonical paths", () => {
  for (const id of [1, 25, 649]) {
    assert.equal(parsePokemonId(String(id)), id);
  }
  for (const value of [
    "",
    "0",
    "-1",
    "650",
    "2147483648",
    "9007199254740993",
    "01",
    "+1",
    "1.0",
    "1.5",
    "1e2",
    "0x1",
    " 1",
    "1 ",
    "1\n",
    "bulbasaur",
    "NaN",
    "Infinity",
  ]) {
    assert.equal(
      parsePokemonId(value),
      null,
      `Reject ${JSON.stringify(value)}`,
    );
  }
});

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

test("a response-body disconnect becomes unavailable and a retry can succeed", async (t) => {
  t.mock.method(console, "error", () => {});
  let disconnected = true;
  t.mock.method(globalThis, "fetch", async () => {
    if (!disconnected) {
      return Response.json({ data: { pokemon: { id: 1 } } });
    }
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"data":'));
        },
        pull(controller) {
          controller.error(new TypeError("Connection terminated mid-body"));
        },
      }),
      { headers: { "content-type": "application/json" } },
    );
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://example.invalid",
      fetch: fetchPokemonApi,
    }),
  });
  t.after(() => client.stop());
  const request = () =>
    requestPokemon(() =>
      client.query({
        query: gql`
          query TestPokemon {
            pokemon {
              id
            }
          }
        `,
        fetchPolicy: "no-cache",
      }),
    );

  assert.deepEqual(await request(), { status: "unavailable" });
  disconnected = false;
  assert.deepEqual(await request(), {
    status: "success",
    data: { pokemon: { id: 1 } },
  });
});
