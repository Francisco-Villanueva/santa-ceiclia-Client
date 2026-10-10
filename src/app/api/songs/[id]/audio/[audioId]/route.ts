import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError, parseNumericId, respond } from "@/lib/api/http";
import { requireMaster } from "@/lib/auth/guard";
import { deleteAudio } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; audioId: string } },
) {
  return respond(async () => {
    await requireMaster(req);
    const songId = parseNumericId(params.id, "Canción");
    const audio = await prisma.songAudio.findFirst({ where: { id: params.audioId, songId } });
    if (!audio) throw new HttpError(404, "Audio no encontrado");
    await prisma.songAudio.delete({ where: { id: audio.id } });
    if (audio.storageKey) await deleteAudio(audio.storageKey).catch(console.error);
    return new NextResponse(null, { status: 204 });
  });
}
