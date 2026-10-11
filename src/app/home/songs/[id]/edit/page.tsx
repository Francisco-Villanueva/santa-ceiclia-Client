import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongEditor } from "@/components/songs/editor/SongEditor";
import { getAuthors, getBranches, getFestivals } from "@/lib/data/catalog";
import { getSongById } from "@/lib/data/songs";
import { NOT_ALLOWED, requireMasterPage } from "../../requireMasterPage";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Editar canción" };

export default async function EditSongPage({ params }: Props) {
  const { id } = await params;
  if (!(await requireMasterPage(`/home/songs/${id}/edit`))) {
    return <p className="text-sm">{NOT_ALLOWED}</p>;
  }

  const [song, authors, festivals, ramas] = await Promise.all([
    getSongById(Number(id)),
    getAuthors(),
    getFestivals(),
    getBranches(),
  ]);
  if (!song) notFound();

  return <SongEditor key={song.id} song={song} authors={authors} festivals={festivals} ramas={ramas} />;
}
