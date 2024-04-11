"use client";
import PlayButton from "@/common/buttons/PlayButton";
import { SongsList } from "@/components";
import { songs } from "@/mocks/songs.json";
import { songStore } from "@/store";
import Image from "next/image";

export default function page() {
  const { songPlaying } = songStore();
  return (
    <div>
      <section className="flex flex-col gap-2 h-full rounded-lg">
        <div className="flex flex-col  items-start gap-1 text-sm">
          <span className="font-bold text-xl">List Of Songs</span>
          <span>Your personal playlist. Updated daily</span>
        </div>
        <hr />
        <div className="flex flex-col   h-[80vh] overflow-auto">
          <SongsList />
        </div>
      </section>
    </div>
  );
}
