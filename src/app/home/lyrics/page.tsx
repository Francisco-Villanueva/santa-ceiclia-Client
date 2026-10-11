import type { Metadata } from "next";
import { LyricsBrowser } from "@/components/lyrics/LyricsBrowser";
import { getSongs } from "@/lib/data/songs";

export const metadata: Metadata = { title: "Letras y acordes" };

export default async function LyricsPage() {
  const songs = await getSongs({ hasLyrics: true });
  return <LyricsBrowser songs={songs} />;
}
