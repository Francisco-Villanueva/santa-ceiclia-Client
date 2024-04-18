"use client";
import { PlaylistPlay } from "@/common";
import { playlistStore, songStore } from "@/store";
import { PlayListType } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export function AlbumCard({ playlist }: { playlist: PlayListType }) {
  const { playlistPlaying } = playlistStore();
  const { isPlaying } = songStore();

  const router = useRouter();

  return (
    <div
      key={playlist.id}
      className="flex flex-col items-start gap-2 hover:bg-accent rounded-lg cursor-pointer transition-all duration-200 p-4 max-md:p-2   w-[80%]"
      onClick={() => router.push(`/home/playlist/${playlist.id}`)}
    >
      <div className="relative  w-full max-md:w-36 aspect-square ">
        <Image
          src={playlist.img}
          alt={playlist.name}
          fill
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col items-start w-full   ">
        <div className="flex  justify-between w-full  ">
          <h2 className="font-semibold text-md inline-block ">
            {playlist.name}
          </h2>
          <span
            className={`  flex  font-semibold  items-center gap-1   ${
              playlistPlaying?.name === playlist.name && isPlaying
                ? "text-primary"
                : ""
            }`}
          >
            {playlist.songs.length}

            <PlaylistPlay playlist={playlist} />
          </span>
        </div>
        <span className="text-xs text-gray-500">{playlist.owner}</span>
      </div>
    </div>
  );
}
