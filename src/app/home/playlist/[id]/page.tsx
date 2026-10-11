import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UserIcon } from "lucide-react";
import { PlaylistPlay } from "@/common/buttons/PlaylistPlay";
import { SearchInput, SongsList } from "@/components";
import { getPublicPlaylist } from "@/lib/data/catalog";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const playlist = await getPublicPlaylist((await params).id);
  return { title: playlist?.name ?? "Playlist no encontrada" };
}

export default async function PlayListPage({ params }: Props) {
  // getPublicPlaylist está envuelta en `cache`: la consulta de generateMetadata se reutiliza.
  const playlist = await getPublicPlaylist((await params).id);
  if (!playlist) notFound();

  return (
    <div className="h-full">
      <section className="flex items-center w-full gap-10 max-md:gap-4 max-sm:gap-2 rounded-xl">
        <div className="w-52 aspect-square max-md:w-32 relative">
          <Image
            src={playlist.img}
            alt=""
            fill
            preload
            sizes="(max-width: 768px) 128px, 208px"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col gap-8 p-6 max-sm:p-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{playlist.name}</h1>
            <div className="text-gray-500 flex items-center gap-1">
              <UserIcon /> <span>{playlist.owner}</span>
            </div>
          </div>
          <p className="text-gray-500">{playlist.songs.length} songs</p>
        </div>
      </section>
      <section className="p-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <PlaylistPlay playlist={playlist} buttonSize={10} />
          <SearchInput />
        </div>
        <h2 className="text-gray-500">List of Songs</h2>
        <SongsList songs={playlist.songs} />
      </section>
    </div>
  );
}
