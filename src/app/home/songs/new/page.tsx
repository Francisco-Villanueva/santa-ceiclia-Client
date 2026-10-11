import type { Metadata } from "next";
import { SongEditor } from "@/components/songs/editor/SongEditor";
import { getAuthors, getBranches, getFestivals } from "@/lib/data/catalog";
import { NOT_ALLOWED, requireMasterPage } from "../requireMasterPage";

export const metadata: Metadata = { title: "Nueva canción" };

export default async function NewSongPage() {
  if (!(await requireMasterPage("/home/songs/new"))) return <p className="text-sm">{NOT_ALLOWED}</p>;

  const [authors, festivals, ramas] = await Promise.all([getAuthors(), getFestivals(), getBranches()]);
  return <SongEditor authors={authors} festivals={festivals} ramas={ramas} />;
}
