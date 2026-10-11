import { NextResponse } from "next/server";
import { notFound, respond } from "@/lib/api/http";
import { getPublicPlaylist } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const playlist = await getPublicPlaylist((await params).id);
    return playlist ? NextResponse.json(playlist) : notFound("Playlist no encontrada");
  });
}
