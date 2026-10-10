import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { songInclude, toSong } from "@/lib/api/dto";
import { HttpError, parseBody, parseNumericId, respond } from "@/lib/api/http";
import { audioSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";
import { headAudio } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Registra un audio: link de YOUTUBE, o un FILE ya subido con la URL de /audio/upload.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  return respond(async () => {
    await requireMaster(req);
    const id = parseNumericId(params.id, "Canción");
    const data = await parseBody(req, audioSchema);

    if (!(await prisma.song.findUnique({ where: { id }, select: { id: true } }))) {
      throw new HttpError(404, "Canción no encontrada");
    }
    if (data.kind === "YOUTUBE") {
      await prisma.songAudio.create({ data: { songId: id, kind: "YOUTUBE", url: data.url } });
    } else {
      if (!data.storageKey.startsWith(`${id}/`)) throw new HttpError(400, "storageKey inválida");
      const object = await headAudio(data.storageKey);
      if (!object) throw new HttpError(400, "El archivo todavía no se subió");
      await prisma.songAudio.create({
        data: {
          songId: id,
          kind: "FILE",
          storageKey: data.storageKey,
          mimeType: object.mimeType,
          sizeBytes: object.sizeBytes,
        },
      });
    }

    const row = await prisma.song.findUniqueOrThrow({ where: { id }, include: songInclude });
    return NextResponse.json(toSong(row), { status: 201 });
  });
}
