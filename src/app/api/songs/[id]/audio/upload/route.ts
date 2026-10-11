import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError, parseBody, parseNumericId, respond } from "@/lib/api/http";
import { audioUploadSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";
import { newAudioKey, presignAudioUpload } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Paso 1: devuelve una URL prefirmada. El cliente hace PUT del archivo y luego
// registra el audio con POST /api/songs/[id]/audio ({ kind: "FILE", storageKey }).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    const p = await params;
    await requireMaster(req);
    const id = parseNumericId(p.id, "Canción");
    const { mimeType, sizeBytes } = await parseBody(req, audioUploadSchema);

    if (!(await prisma.song.findUnique({ where: { id }, select: { id: true } }))) {
      throw new HttpError(404, "Canción no encontrada");
    }
    const storageKey = newAudioKey(id, mimeType);
    const uploadUrl = await presignAudioUpload(storageKey, mimeType, sizeBytes);
    return NextResponse.json({ uploadUrl, storageKey, headers: { "Content-Type": mimeType } });
  });
}
