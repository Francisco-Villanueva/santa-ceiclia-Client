import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { songInclude, toSong } from "@/lib/api/dto";
import { HttpError, parseBody, parseNumericId, respond } from "@/lib/api/http";
import { lyricsSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";
import { convertChordsOverLyrics } from "@/lib/chords";
import { detectChords } from "@/lib/lyrics";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function assertSong(id: number) {
  if (!(await prisma.song.findUnique({ where: { id }, select: { id: true } }))) {
    throw new HttpError(404, "Canción no encontrada");
  }
}

// Crea o reemplaza la letra de la canción.
export async function PUT(req: Request, { params }: Ctx) {
  return respond(async () => {
    const p = await params;
    await requireMaster(req);
    const id = parseNumericId(p.id, "Canción");
    const data = await parseBody(req, lyricsSchema);
    await assertSong(id);

    // Se guarda siempre en ChordPro: el cifrado clásico (acordes sobre la letra) se convierte acá.
    const content =
      data.format === "CHORDS_OVER_LYRICS" ? convertChordsOverLyrics(data.content) : data.content;
    const lyrics = {
      content,
      format: "CHORDPRO" as const,
      originalKey: data.originalKey ?? null,
      hasChords: detectChords(content, "CHORDPRO"),
    };
    await prisma.songLyrics.upsert({
      where: { songId: id },
      create: { songId: id, ...lyrics },
      update: lyrics,
    });

    const row = await prisma.song.findUniqueOrThrow({ where: { id }, include: songInclude });
    return NextResponse.json(toSong(row));
  });
}

export async function DELETE(req: Request, { params }: Ctx) {
  return respond(async () => {
    const p = await params;
    await requireMaster(req);
    const id = parseNumericId(p.id, "Canción");
    await assertSong(id);
    await prisma.songLyrics.deleteMany({ where: { songId: id } });
    return new NextResponse(null, { status: 204 });
  });
}
