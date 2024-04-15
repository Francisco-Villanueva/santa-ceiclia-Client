"use client";

import { PauseIcon, PlayIcon } from "@/icons";
import { playlistStore, songStore } from "@/store";
import { PlayListType } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export function AlbumList() {
  const { playlists, setPlaylistsPlaying, playlistPlaying } = playlistStore();
  const { addToQueue, handlePlaySong, isPlaying } = songStore();
  const handlePlaylist = (playlist: PlayListType) => {
    setPlaylistsPlaying(playlist);
    playlist.songs.forEach((song, index) => {
      if (index === 0) handlePlaySong(song);
      addToQueue(song);
    });
  };

  return (
    <ScrollArea className="max-w-full h-full   ">
      {playlists.length ? (
        <div className="flex gap-2 items-center">
          {playlists.map((playlist) => (
            <div
              key={playlist.owner}
              className="flex flex-col items-start gap-2 hover:bg-accent rounded-lg cursor-pointer transition-all duration-200 p-4"
            >
              <div className="relative h-80 w-60 ">
                <Image
                  src={playlist.img}
                  alt={playlist.name}
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col items-start  w-full ">
                <div className="flex justify-between w-full ">
                  <h2 className="font-semibold text-md">{playlist.name}</h2>
                  <span
                    className={`    font-semibold flex items-center gap-1 ${
                      playlistPlaying?.name === playlist.name && isPlaying
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    {playlist.songs.length}

                    <button onClick={() => handlePlaylist(playlist)}>
                      {playlistPlaying?.name === playlist.name && isPlaying ? (
                        <PauseIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </button>
                  </span>
                </div>
                <span className="text-xs text-gray-500">{playlist.owner}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-32 w-32">
          <Skeleton className="w-30 h-30" />
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
