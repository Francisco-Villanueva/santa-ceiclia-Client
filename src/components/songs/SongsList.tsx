"use client";
import { songStore } from "@/store";
import { SongType } from "@/types";
import { useToast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { SongListCard } from "@/common";

export function SongsList({
  songs,
  type = "play",
}: {
  songs?: SongType[];
  type?: "read" | "play";
}) {
  const {
    songPlaying,
    addToQueue,
    songs: ALLSONGS,
    handlePlaySong,
    isPlaying,
    setSelectedSong,
  } = songStore();
  const { toast } = useToast();

  const handleSelectSong = (song: SongType) => {
    if (type === "read") {
      return setSelectedSong(song);
    } else {
      if (song.id === songPlaying?.id) return;
      if (!song.sound) {
        return toast({
          title: `${song.title}\n  doesn't have soundtrack`,
          duration: 3000,
          variant: "destructive",
          description: `Author: ${song.author}`,
        });
      }
      handlePlaySong(song);
      addToQueue(song);
      if (!isPlaying || song.id !== songPlaying?.id) {
      }
      toast({
        title: `Listening: ${song.title}`,
        duration: 3000,
        description: `Author: ${song.author}`,
      });
    }
  };

  const songsToShow = songs ? songs : ALLSONGS;
  return (
    <div className="flex flex-col   max-h-full h-full overflow-y-auto">
      {songsToShow ? (
        songsToShow.map((song, index) => (
          <SongListCard
            index={index}
            key={song.id}
            song={song}
            handleSelectSong={handleSelectSong}
            type={type}
          />
        ))
      ) : (
        <div className="flex flex-col gap-4">
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
          <Skeleton className=" p-2 rounded-xl w-full h-10" />
        </div>
      )}
    </div>
  );
}
