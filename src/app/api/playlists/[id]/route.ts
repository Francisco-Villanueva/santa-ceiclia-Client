import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { playlistInclude, toPlaylist } from "@/lib/api/dto";
import { notFound, respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  return respond(async () => {
    const row = await prisma.playlist.findFirst({
      where: { id: params.id, isPublic: true },
      include: playlistInclude,
    });
    return row ? NextResponse.json(toPlaylist(row)) : notFound("Playlist no encontrada");
  });
}
