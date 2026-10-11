import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { songInclude, toSong } from "@/lib/api/dto";
import { notFound, parseBody, parseNumericId, respond } from "@/lib/api/http";
import { assertRefs } from "@/lib/api/refs";
import { songUpdateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";
import { getSongById } from "@/lib/data/songs";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  return respond(async () => {
    await requireMaster(req);
    const id = parseNumericId((await params).id, "Canción");
    const data = await parseBody(req, songUpdateSchema);
    await assertRefs({ authorId: data.authorId, festivalId: data.festivalId });

    const row = await prisma.song.update({ where: { id }, data, include: songInclude });
    return NextResponse.json(toSong(row));
  });
}

// Borra también su letra, sus audios y su presencia en playlists.
export async function DELETE(req: Request, { params }: Ctx) {
  return respond(async () => {
    await requireMaster(req);
    const id = parseNumericId((await params).id, "Canción");
    await prisma.song.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  });
}

export async function GET(_req: Request, { params }: Ctx) {
  return respond(async () => {
    const song = await getSongById(parseNumericId((await params).id, "Canción"));
    return song ? NextResponse.json(song) : notFound("Canción no encontrada");
  });
}
