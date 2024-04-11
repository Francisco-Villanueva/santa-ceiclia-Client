import PlayButton from "@/common/buttons/PlayButton";
import { songs } from "@/mocks/songs.json";
import { songStore } from "@/store";
import Image from "next/image";

export function SongsList() {
  const { songPlaying } = songStore();
  return (
    <div className="flex flex-col   max-h-full h-full overflow-y-auto">
      {songs.map((song, index) => (
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
          {song.sound && <PlayButton song={song} />}
        </div>
      ))}
    </div>
  );
}
