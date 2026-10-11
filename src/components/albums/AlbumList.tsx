import { PlayListType } from "@/types";
import { AlbumCard } from "./AlbumCard";

export function AlbumList({ playlists, grid }: { playlists: PlayListType[]; grid?: boolean }) {
  if (!playlists.length) {
    return <p className="text-sm text-gray-500 p-2">Todavía no hay playlists.</p>;
  }
  return (
    <div className={grid ? "grid grid-cols-4 max-md:grid-cols-2" : "flex gap-2 items-center"}>
      {playlists.map((playlist, i) => (
        <AlbumCard playlist={playlist} key={playlist.id} eager={i === 0} />
      ))}
    </div>
  );
}
