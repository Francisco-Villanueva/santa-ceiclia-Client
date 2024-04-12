"use client";
import PlayButton from "@/common/buttons/PlayButton";
import { DotsMenuIcon, LyricsIcon, PlaylistIcon } from "@/icons";
import { songs as ALLSONGS } from "@/mocks/songs.json";
import { songStore } from "@/store";
import { SongType } from "@/types";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Dropdown } from "./Menu";
import PlayBounce from "./soundPlayer/PlayBounce";

export function SongsList({ songs }: { songs?: SongType[] }) {
  const {
    songPlaying,
    addToQueue,
    setSelectedSong,
    handlePlaySong,
    isPlaying,
  } = songStore();
  const { toast } = useToast();
  const handleQueue = (song: SongType) => {
    addToQueue(song);
    toast({
      description: `${song.title} add to queue`,
      duration: 1200,
    });
  };

  const handleSelectSong = (song: SongType) => {
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
      {songsToShow.map((song, index) => (
        <article
          className={`flex  gap-2 p-1 hover:bg-accent w-full transition-all duration-200 cursor-pointer rounded-md ${
            songPlaying?.id === song.id && "bg-accent"
          }  `}
          key={song.id}
        >
          <div className="w-6 flex items-center z-40">
            {songPlaying?.id === song.id && <PlayButton song={songPlaying} />}
          </div>
          <section className={`flex justify-between  w-full  `}>
            <div
              className="flex  items-center gap-2  flex-grow relative   "
              onClick={() => handleSelectSong(song)}
            >
              <div className="relative h-10  aspect-square rounded-full  ">
                <Image
                  src={
                    index < 6
                      ? `/covers/cover${index}.jpg`
                      : "/covers/genericCover.jpg"
                  }
                  alt={song.title}
                  fill
                  objectFit="cover"
                  className="rounded-full aspect-square"
                />
              </div>
              <div className="flex flex-col items-start  select-none ">
                <h2
                  className={`font-semibold text-md flex items-center  ${
                    songPlaying?.id === song.id && "text-primary"
                  }`}
                >
                  {song.title} {songPlaying?.id === song.id && <PlayBounce />}
                </h2>
                <span className="text-xs text-gray-500">{song.author}</span>
              </div>
            </div>
            {(song.sound || song.lyrics) && <Dropdown song={song} />}
          </section>
        </article>
      ))}
    </div>
  );
}
