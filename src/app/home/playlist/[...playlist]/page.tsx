"use client";
import { PlaylistPlay } from "@/common";
import { SearchInput, SongsList } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { playlistStore } from "@/store";
import { PlayListType } from "@/types";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PlayListPage() {
  const params = useParams();
  const { playlists } = playlistStore();
  const [playlist, setPlaylist] = useState<PlayListType>();
  useEffect(() => {
    if (params.playlist[0]) {
      setPlaylist(playlists.filter((p) => p.id === params.playlist[0])[0]);
    }
  }, [params.playlist]);

  return playlist ? (
    <div className=" h-full">
      <section className="flex  items-center w-full gap-10 max-md:gap-4 max-sm:gap-2 rounded-xl    ">
        <div className="  w-52 aspect-square max-md:w-32 relative ">
          <Image
            src={playlist?.img || ""}
            alt="playlisyname"
            className="rounded-lg"
            fill
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col  gap-8 z-10 p-6 max-sm:p-0">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">{playlist?.name}</h2>
            <div className="text-gray-300 flex items-center gap-1">
              <UserIcon /> <span>{playlist?.owner} </span>
            </div>
          </div>
          <div>
            <p className="text-gray-500">{playlist?.songs.length} songs</p>
          </div>
        </div>
      </section>
      <section className="p-2 flex flex-col gap-2">
        <div className="  flex items-center justify-between">
          <PlaylistPlay playlist={playlist} />
          <SearchInput />
        </div>
        <h2 className="text-gray-500">List of Songs </h2>
        <SongsList songs={playlist?.songs} />
      </section>
    </div>
  ) : (
    <Skeleton />
  );
}
