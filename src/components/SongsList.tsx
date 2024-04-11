import PlayButton from "@/common/buttons/PlayButton";
import { PlaylistIcon } from "@/icons";
import { songs as ALLSONGS } from "@/mocks/songs.json";
import { songStore } from "@/store";
import { SongType } from "@/types";
import Image from "next/image";
import { useToast } from "./ui/use-toast";

export function SongsList({ songs }: { songs?: SongType[] }) {
  const { songPlaying, addToQueue } = songStore();
  const { toast } = useToast();
  const handleQueue = (song: SongType) => {
    addToQueue(song);
    toast({
      description: `${song.title} add to queue`,
      duration: 1200,
    });
  };

  const songsToShow = songs ? songs : ALLSONGS;
  return (
    <div className="flex flex-col   max-h-full h-full overflow-y-auto">
      {songsToShow.map((song, index) => (
        <div
          key={song.id}
          className={`flex justify-between ${
            songPlaying?.id === song.id && "bg-primary"
          }  items-center p-2 hover:bg-primary rounded-lg cursor-pointer transition-all duration-200`}
        >
          <div className="flex  items-start gap-2  ">
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
            <div className="flex flex-col items-start  ">
              <h2 className="font-semibold text-md">{song.title}</h2>
              <span className="text-xs text-gray-500">{song.author}</span>
            </div>
          </div>
          {song.sound && (
            <div className="flex items-center">
              <button onClick={() => handleQueue(song)}>
                <PlaylistIcon />
              </button>
              <PlayButton song={song} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
