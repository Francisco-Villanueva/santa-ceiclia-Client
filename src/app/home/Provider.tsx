"use client";
import SoundPlayer from "@/components/soundPlayer/SoundPlayer";
import { PlaylistService } from "@/services/playlists.services";
import { RamaServices } from "@/services/ramas.services";
import { SantaCeciliaServices } from "@/services/santacecilia.services";
import { SongService } from "@/services/song.services";
import { playlistStore, ramaStore, songStore, santacecliaStore } from "@/store";
import React, { ReactNode, useEffect, useState } from "react";

export function LoadingBar() {
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
  const { setSantacecilias } = santacecliaStore();
  const { setRamas } = ramaStore();
  useEffect(() => {
    // setIsLoading(true);
    SongService.getAllSongs().then((res) => setSongs(res));
    PlaylistService.getAll().then((res) => setPlaylists(res));
    SantaCeciliaServices.getAll().then((res) => setSantacecilias(res));
    RamaServices.getAll().then((res) => setRamas(res));
  }, []);
  return (
    <div>
      {loading && <LoadingBar />}
      {children}
      <SoundPlayer />
    </div>
  );
}
