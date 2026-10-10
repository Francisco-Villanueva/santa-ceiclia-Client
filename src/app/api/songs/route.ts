import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { songInclude, toSong } from "@/lib/api/dto";
import { parseBody, respond } from "@/lib/api/http";
import { assertRefs } from "@/lib/api/refs";
import { songCreateSchema } from "@/lib/api/schemas";
import { requireMaster } from "@/lib/auth/guard";

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
    const p = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams));

    const where: Prisma.SongWhereInput = {
      ...(p.q && {
        OR: [
          { title: { contains: p.q, mode: "insensitive" } },
          { author: { name: { contains: p.q, mode: "insensitive" } } },
        ],
      }),
      ...(p.branch && { author: { branch: { slug: p.branch } } }),
      ...(p.author && { authorId: p.author }),
      ...(p.year && { year: p.year }),
      ...(p.festival && { festivalId: p.festival }),
      ...(p.hasChords !== undefined
        ? { lyrics: { is: { hasChords: p.hasChords } } }
        : p.hasLyrics !== undefined && {
            lyrics: p.hasLyrics ? { isNot: null } : { is: null },
          }),
      ...(p.hasAudio !== undefined && {
        audios: p.hasAudio ? { some: {} } : { none: {} },
      }),
    };

    const rows = await prisma.song.findMany({
      where,
      include: songInclude,
      orderBy: { id: "desc" },
    });
    return NextResponse.json(rows.map(toSong));
  });
}
