import "server-only";
import { cache } from "react";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { songInclude, toSong } from "@/lib/api/dto";

export type SongFilters = {
  /** Busca en título y nombre del autor. */
  q?: string;
  /** Slug de la rama (autor de tipo rama). */
  branch?: string;
  author?: string;
  year?: number;
  festival?: string;
  hasLyrics?: boolean;
  hasChords?: boolean;
  hasAudio?: boolean;
};

function songWhere(f: SongFilters): Prisma.SongWhereInput {
  return {
    ...(f.q && {
      OR: [
        { title: { contains: f.q, mode: "insensitive" } },
        { author: { name: { contains: f.q, mode: "insensitive" } } },
      ],
    }),
    ...(f.branch && { author: { branch: { slug: f.branch } } }),
    ...(f.author && { authorId: f.author }),
    ...(f.year && { year: f.year }),
    ...(f.festival && { festivalId: f.festival }),
    ...(f.hasChords !== undefined
      ? { lyrics: { is: { hasChords: f.hasChords } } }
      : f.hasLyrics !== undefined && {
          lyrics: f.hasLyrics ? { isNot: null } : { is: null },
        }),
    ...(f.hasAudio !== undefined && {
      audios: f.hasAudio ? { some: {} } : { none: {} },
    }),
  };
}

/** Canciones de la más nueva a la más vieja. */
export async function getSongs(filters: SongFilters = {}) {
  const rows = await prisma.song.findMany({
    where: songWhere(filters),
    include: songInclude,
    orderBy: { id: "desc" },
  });
  return rows.map(toSong);
}

export const getSongById = cache(async (id: number) => {
  if (!Number.isInteger(id)) return null;
  const row = await prisma.song.findUnique({ where: { id }, include: songInclude });
  return row ? toSong(row) : null;
});

/** Primera canción con audio, para que el reproductor tenga algo que ofrecer al entrar. */
export async function getFirstPlayableSong() {
  const row = await prisma.song.findFirst({
    where: { audios: { some: {} } },
    include: songInclude,
    orderBy: { id: "desc" },
  });
  return row ? toSong(row) : null;
}
