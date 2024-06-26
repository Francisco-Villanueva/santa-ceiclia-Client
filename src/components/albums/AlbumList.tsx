"use client";

import { playlistStore } from "@/store";
import { Skeleton } from "../ui/skeleton";
import { AlbumCard } from "./AlbumCard";

export function AlbumList() {
  const { playlists } = playlistStore();
  return playlists.length ? (
    <div className="flex  gap-2 items-center">
      {playlists.map((playlist) => (
        <AlbumCard playlist={playlist} key={playlist.id} />
      ))}
    </div>
  ) : (
    <div className="h-32 w-32">
      <Skeleton className="w-30 h-30" />
    </div>
  );
}
