import { SongsList } from "@/components";
import { NewSongButton } from "@/components/songs/NewSongButton";

export default function page() {
  return (
    <div>
      <section className="flex flex-col gap-2 h-full rounded-lg">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col  items-start gap-1 text-sm">
            <span className="font-bold text-xl">List Of Songs</span>
            <span>Your personal playlist. Updated daily</span>
          </div>
          <NewSongButton />
        </div>
        <hr />
        <div className="flex flex-col   h-[80vh] overflow-auto">
          <SongsList />
        </div>
      </section>
    </div>
  );
}
