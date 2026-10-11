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

/** Minúsculas y sin tildes, para que "cancion" encuentre "CANCIÓN". */
const normalize = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function songWhere(f: Omit<SongFilters, "q">): Prisma.SongWhereInput {
  return {
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
export async function getSongs({ q, ...filters }: SongFilters = {}) {
  const rows = await prisma.song.findMany({
    where: songWhere(filters),
    include: songInclude,
    orderBy: { id: "desc" },
  });
  const songs = rows.map(toSong);
  // El texto se filtra acá y no en SQL: ILIKE distingue tildes y Postgres necesita la extensión
  // unaccent para ignorarlas. Con unas decenas de canciones no pesa; si el catálogo crece
  // mucho, conviene pasarlo a la base (unaccent o una columna normalizada).
  const term = q ? normalize(q.trim()) : "";
  if (!term) return songs;
  return songs.filter((s) => normalize(`${s.title} ${s.author}`).includes(term));
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
