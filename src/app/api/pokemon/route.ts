import { NextResponse } from "next/server";
import { getPokemon } from "@/lib/pokemon-data";
import { parsePokemonFilters } from "@/lib/pokemon-filters";
import { POKEMON_MAX_ID } from "@/lib/pokemon-id";

// Browser responses stay fresh; successful batches use the server Data Cache.
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get("after");
  const afterId = cursor === null ? NaN : Number(cursor);

  if (
    !cursor ||
    !/^\d+$/.test(cursor) ||
    !Number.isInteger(afterId) ||
    afterId < 0 ||
    afterId >= POKEMON_MAX_ID
  ) {
    return NextResponse.json(
      { error: "Invalid Pokémon page cursor." },
      { status: 400, headers },
    );
  }

  const result = await getPokemon(afterId, parsePokemonFilters(searchParams));

  if (result.status === "unavailable") {
    return NextResponse.json(
      { error: "The Pokémon data service is unavailable." },
      { status: 503, headers },
    );
  }

  return NextResponse.json(result.data, { headers });
}
