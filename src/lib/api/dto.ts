import "server-only";
import { Prisma } from "@/generated/prisma/client";
import type {
  AuthorType,
  PlayListType,
  RamaType,
  SantaCeciliaType,
  SongType,
} from "@/types";

// Qué se trae de la base para cada recurso; los mappers de abajo dependen de estas formas.
export const songInclude = {
  author: true,
  lyrics: true,
  audios: { orderBy: { createdAt: "asc" } },
} satisfies Prisma.SongInclude;

export const festivalInclude = {
  songs: { include: songInclude, orderBy: { id: "desc" } },
} satisfies Prisma.FestivalInclude;

export const playlistInclude = {
  owner: { select: { name: true } },
  songs: {
    orderBy: { position: "asc" },
    include: { song: { include: songInclude } },
  },
} satisfies Prisma.PlaylistInclude;

type SongRow = Prisma.SongGetPayload<{ include: typeof songInclude }>;
type AudioRow = SongRow["audios"][number];

const STORAGE_PUBLIC_URL = process.env.STORAGE_PUBLIC_URL;

function audioUrl(audio: AudioRow): string | null {
  if (audio.kind === "YOUTUBE") return audio.url;
  // FILE: se resuelve contra el storage público cuando esté configurado.
  if (audio.storageKey && STORAGE_PUBLIC_URL) {
    return `${STORAGE_PUBLIC_URL}/${audio.storageKey}`;
  }
  return null;
}

export function toSong(row: SongRow): SongType {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    authorId: row.authorId,
    author: row.author.name,
    branchId: row.author.branchId,
    festivalId: row.festivalId,
    place: row.place,
    lyrics: row.lyrics?.content ?? null,
    lyricsFormat: row.lyrics?.format ?? null,
    hasChords: row.lyrics?.hasChords ?? false,
    originalKey: row.lyrics?.originalKey ?? null,
    sound: row.audios.map(audioUrl).find(Boolean) ?? null,
    audios: row.audios.map((a) => ({ id: a.id, kind: a.kind, url: audioUrl(a) })),
  };
}

export function toRama(row: Prisma.BranchGetPayload<object>): RamaType {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    img: { light: row.logoLight ?? "", dark: row.logoDark ?? "" },
  };
}

export function toAuthor(row: Prisma.AuthorGetPayload<object>): AuthorType {
  return { id: row.id, name: row.name, type: row.type, branchId: row.branchId };
}

export function toFestival(
  row: Prisma.FestivalGetPayload<{ include: typeof festivalInclude }>,
): SantaCeciliaType {
  return {
    id: row.id,
    year: row.year,
    place: row.place,
    winner: row.winnerBranchId,
    songs: row.songs.map(toSong),
  };
}

export function toPlaylist(
  row: Prisma.PlaylistGetPayload<{ include: typeof playlistInclude }>,
): PlayListType {
  return {
    id: row.id,
    name: row.name,
    img: row.cover ?? "/covers/genericCover.jpg",
    owner: row.owner.name,
    songs: row.songs.map((ps) => toSong(ps.song)),
  };
}
