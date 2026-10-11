import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  festivalInclude,
  playlistInclude,
  toAuthor,
  toFestival,
  toPlaylist,
  toRama,
} from "@/lib/api/dto";

// Lecturas de ramas, autores, festivales y playlists. Las usan tanto las páginas (Server
// Components) como los Route Handlers, así que la forma de los datos es una sola.

export const getBranches = cache(async () => {
  const rows = await prisma.branch.findMany({ orderBy: { position: "asc" } });
  return rows.map(toRama);
});

/** Acepta el id de la rama o su slug (ej. "rovers"). */
export async function getBranch(idOrSlug: string) {
  const row = await prisma.branch.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });
  return row ? toRama(row) : null;
}

export async function getAuthors() {
  const rows = await prisma.author.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
  return rows.map(toAuthor);
}

export const getFestivals = cache(async () => {
  const rows = await prisma.festival.findMany({
    include: festivalInclude,
    orderBy: { year: "desc" },
  });
  return rows.map(toFestival);
});

export const getFestival = cache(async (id: string) => {
  const row = await prisma.festival.findUnique({ where: { id }, include: festivalInclude });
  return row ? toFestival(row) : null;
});

/** Solo playlists públicas hasta que existan las playlists de los miembros. */
export const getPublicPlaylists = cache(async () => {
  const rows = await prisma.playlist.findMany({
    where: { isPublic: true },
    include: playlistInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toPlaylist);
});

export const getPublicPlaylist = cache(async (id: string) => {
  const row = await prisma.playlist.findFirst({
    where: { id, isPublic: true },
    include: playlistInclude,
  });
  return row ? toPlaylist(row) : null;
});
