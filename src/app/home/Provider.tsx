"use client";
import SoundPlayer from "@/components/soundPlayer/SoundPlayer";
import { PlaylistService } from "@/services/playlists.services";
import { SongService } from "@/services/song.services";
import { playlistStore, songStore } from "@/store";
import React, { ReactNode, useEffect, useState } from "react";

function LoadingBar() {
  return (
    <div className="absolute z-10 top-0 left-0 w-full h-[2px] bg-gray-200">
      <div className="h-full bg-primary animate-loader"></div>
    </div>
  );
}
export default function Provider({ children }: { children: ReactNode }) {
  const [loading, setIsLoading] = useState(false);
  const { setSongs } = songStore();
  const { setPlaylists } = playlistStore();
  useEffect(() => {
    setIsLoading(true);
    SongService.getAllSongs()
      .then((res) => {
        setSongs(res);
      })
      .finally(() => setIsLoading(false));
    PlaylistService.getAll()
      .then((res) => {
        setPlaylists(res);
      })
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <div>
      {loading && <LoadingBar />}
      {children}
      <SoundPlayer />
    </div>
  );
}
