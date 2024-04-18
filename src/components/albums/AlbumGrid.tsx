"use client";
import { playlistStore } from "@/store";
import { AlbumCard } from "./AlbumCard";
import { Skeleton } from "../ui/skeleton";

export function AlbumGrid() {
  const { playlists } = playlistStore();
  return playlists.length ? (
    <div className="grid grid-cols-4">
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
