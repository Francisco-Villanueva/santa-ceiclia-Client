import type { Metadata } from "next";
import { SongsList } from "@/components";
import { NewSongButton } from "@/components/songs/NewSongButton";
import { getSongs } from "@/lib/data/songs";

export const metadata: Metadata = { title: "Canciones" };

export default async function SongsPage() {
  const songs = await getSongs();
  return (
    <section className="flex flex-col gap-2 h-full rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col items-start gap-1 text-sm">
          <h1 className="font-bold text-xl">List Of Songs</h1>
          <span>Your personal playlist. Updated daily</span>
        </div>
        <NewSongButton />
      </div>
      <hr />
      <div className="flex flex-col h-[80vh] overflow-auto">
        <SongsList songs={songs} />
      </div>
    </section>
  );
}
