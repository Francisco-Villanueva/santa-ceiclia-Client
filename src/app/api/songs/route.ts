import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { songInclude, toSong } from "@/lib/api/dto";
import { parseBody, respond } from "@/lib/api/http";
import { assertRefs } from "@/lib/api/refs";
import { songCreateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";
import { getSongs } from "@/lib/data/songs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return respond(async () => {
    const user = await requireMaster(req);
    const data = await parseBody(req, songCreateSchema);
    await assertRefs({ authorId: data.authorId, festivalId: data.festivalId });

    const row = await prisma.song.create({
      data: {
        title: data.title,
        year: data.year,
        place: data.place ?? null,
        authorId: data.authorId,
        festivalId: data.festivalId ?? null,
        createdById: user.id,
      },
      include: songInclude,
    });
    return NextResponse.json(toSong(row), { status: 201 });
  });
}

const bool = z.enum(["true", "false"]).transform((v) => v === "true");

const querySchema = z.object({
  q: z.string().trim().min(1).optional(), // busca en título y autor
  branch: z.string().optional(), // slug de la rama (autor de tipo rama)
  author: z.string().optional(),
  year: z.coerce.number().int().optional(),
  festival: z.string().optional(), // id del festival
  hasLyrics: bool.optional(),
  hasChords: bool.optional(),
  hasAudio: bool.optional(),
});

export async function GET(req: NextRequest) {
  return respond(async () => {
    const filters = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
    return NextResponse.json(await getSongs(filters));
  });
}
