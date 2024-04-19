import { SongType } from "@/types";
import RamaImage from "../rama/RamaImage";
import { ramaStore, songStore } from "@/store";
import PlayButton from "@/common/buttons/PlayButton";
import { SongListCard } from "@/common";
import { useToast } from "../ui/use-toast";

type RamaNames =
  | "Alitas"
  | "Manada"
  | "Caravana"
  | "Unidad"
  | "Caminantes"
  | "Solar"
  | "Clan"
  | "Rovers";
interface SantaSongsListProps {
  songs: SongType[];
}

function SongCard({
  ramaName,
  songs,
}: {
  ramaName: RamaNames;
  songs: SongType[];
}) {
  const song = songs.filter((song) => song.author === ramaName)[0];
  const { handlePlaySong, addToQueue, songPlaying, isPlaying } = songStore();
  const { toast } = useToast();

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
    }
    toast({
      title: `Listening: ${song.title}`,
      duration: 3000,
      description: `Author: ${song.author}`,
    });
  };

  return (
    <div className="flex items-center gap-2 transition-all duration-300 hover:bg-muted px-2 rounded-md">
      <SongListCard handleSelectSong={handleSelectSong} song={song} />
    </div>
  );
}
export function SantaSongsList({ songs }: SantaSongsListProps) {
  const arr: { area: string; ramas: RamaNames[] }[] = [
    {
      area: "Área 1",
      ramas: ["Alitas", "Manada"],
    },
    {
      area: "Área 2",
      ramas: ["Caravana", "Unidad"],
    },
    {
      area: "Área 3",
      ramas: ["Solar", "Caminantes"],
    },
    {
      area: "Área 4",
      ramas: ["Clan", "Rovers"],
    },
  ];
  return (
    <div className="flex flex-col gap-6 h-full">
      {arr.map((santa, i) => (
        <section className="flex flex-col gap-1 " key={santa.area + i}>
          <h2 className="text-xl font-semibold text-accent-foreground">
            {santa.area}
          </h2>
          <hr />
          <div>
            <SongCard ramaName={santa.ramas[0]} songs={songs} />
            <SongCard ramaName={santa.ramas[1]} songs={songs} />
          </div>
        </section>
      ))}
    </div>
  );
}
