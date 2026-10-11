"use client";

import { SongListCard } from "@/common/songs/ListCard";
import { SongType } from "@/types";
import { usePlaySong } from "./usePlaySong";

type Props = {
  songs: SongType[];
  /** "play" reproduce al tocar; "read" llama a onSelect (ej. para mostrar la letra). */
  type?: "read" | "play";
  onSelect?: (song: SongType) => void;
};

export function SongsList({ songs, type = "play", onSelect }: Props) {
  const playSong = usePlaySong();
  const handleSelect = type === "read" && onSelect ? onSelect : playSong;

  if (!songs.length) {
    return <p className="text-sm text-gray-500 p-2">No hay canciones para mostrar.</p>;
  }

  return (
    <div className="flex flex-col max-h-full h-full overflow-y-auto">
      {songs.map((song, index) => (
        <SongListCard
          index={index}
          key={song.id}
          song={song}
          handleSelectSong={handleSelect}
          type={type}
        />
      ))}
    </div>
  );
}
