import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { playlistInclude, toPlaylist } from "@/lib/api/dto";
import { respond } from "@/lib/api/http";

export const dynamic = "force-dynamic";

// Solo playlists públicas hasta que exista autenticación.
export async function GET() {
  return respond(async () => {
    const rows = await prisma.playlist.findMany({
      where: { isPublic: true },
      include: playlistInclude,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows.map(toPlaylist));
  });
}
