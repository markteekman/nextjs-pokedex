import { NextResponse } from "next/server";
import { getPokemon } from "@/lib/pokemon-data";

// Browser responses stay fresh; successful batches use the server Data Cache.
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const cursor = new URL(request.url).searchParams.get("after");
  const afterId = cursor === null ? NaN : Number(cursor);

  if (
    !cursor ||
    !/^\d+$/.test(cursor) ||
    !Number.isInteger(afterId) ||
    afterId < 0 ||
    afterId >= 649
  ) {
    return NextResponse.json(
      { error: "Invalid Pokémon page cursor." },
      { status: 400, headers },
    );
  }

  const result = await getPokemon(afterId);

  if (result.status === "unavailable") {
    return NextResponse.json(
      { error: "The Pokémon data service is unavailable." },
      { status: 503, headers },
    );
  }

  return NextResponse.json(result.data, { headers });
}
