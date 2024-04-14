import { SongsList } from "@/components";

export default function page() {
  return (
    <div>
      <section className="flex flex-col gap-2 h-full rounded-lg">
        <div className="flex flex-col  items-start gap-1 text-sm">
          <span className="font-bold text-xl">List Of Songs</span>
          <span>Your personal playlist. Updated daily</span>
        </div>
        <hr />
        <div className="flex flex-col   h-[80vh] overflow-auto">
          <SongsList />
        </div>
      </section>
    </div>
  );
}
