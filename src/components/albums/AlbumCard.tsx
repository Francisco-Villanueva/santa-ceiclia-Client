import Image from "next/image";
import Link from "next/link";
import { PlaylistPlay } from "@/common/buttons/PlaylistPlay";
import { PlayListType } from "@/types";

/** `eager`: la primera tarjeta suele ser la imagen más grande visible al cargar (LCP). */
export function AlbumCard({ playlist, eager }: { playlist: PlayListType; eager?: boolean }) {
  return (
    <Link
      href={`/home/playlist/${playlist.id}`}
      className="flex flex-col items-start gap-2 hover:bg-accent rounded-lg transition-all duration-200 p-4 max-md:p-2 w-[80%]"
    >
      <div className="relative w-full max-md:w-36 aspect-square">
        <Image
          src={playlist.img}
          alt=""
          fill
          loading={eager ? "eager" : undefined}
          sizes="(max-width: 768px) 144px, 25vw"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col items-start w-full">
        <div className="flex justify-between w-full">
          <h2 className="font-semibold text-md inline-block">{playlist.name}</h2>
          <span className="flex font-semibold items-center gap-1">
            {playlist.songs.length}
            {playlist.songs.length > 0 && <PlaylistPlay playlist={playlist} />}
          </span>
        </div>
        <span className="text-xs text-gray-500">{playlist.owner}</span>
      </div>
    </Link>
  );
}
