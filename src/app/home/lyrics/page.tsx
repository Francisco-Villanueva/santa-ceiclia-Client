"use client";
import { SongsList } from "@/components";
import { LyricsViewer } from "@/components/lyrics/LyricsViewer";
import { songStore } from "@/store";

export default function page() {
  const { selectedSong, songs } = songStore();
  const filteredSongs = songs?.filter((song) => song.lyrics);

  return (
    <div className=" rounded-xl  h-full w-full flex justify-between gap-2 max-md:flex-col md:p-2  ">
      <div className="w-1/4  h-full flex flex-col gap-2 p-2 border rounded-xl max-md:w-full max-md:h-1/4 ">
        <h2 className="font-bold">Canciones con Letra</h2>
        <div className="w-1/3 border" />
        <SongsList songs={filteredSongs} type="read" />
      </div>

      <div className="min-h-full flex-grow  md:max-w-3/4 w-3/4 border  rounded-xl max-md:w-full   ">
        {selectedSong ? (
          <div className="flex flex-col  h-full max-h-full bg-accent rounded-xl p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold"> {selectedSong.title}</h2>
              <span className="text-xs"> - {selectedSong.author}</span>
            </div>
            <LyricsViewer key={selectedSong.id} song={selectedSong} />
          </div>
        ) : (
          <div className="h-full w-full flex justify-center items-center rounded-xl ">
            elegi una canccion
          </div>
        )}
      </div>
    </div>
  );
}
