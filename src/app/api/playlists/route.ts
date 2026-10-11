import { NextResponse } from "next/server";
import { respond } from "@/lib/api/http";
import { getPublicPlaylists } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

// Solo playlists públicas hasta que existan las playlists de los miembros.
export async function GET() {
  return respond(async () => NextResponse.json(await getPublicPlaylists()));
}
