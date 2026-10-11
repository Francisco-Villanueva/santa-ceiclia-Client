import type { Metadata } from "next";
import { RamaList } from "@/components";
import { AlbumList } from "@/components/albums";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getBranches, getPublicPlaylists } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Playlists" };

export default async function PlaylistsPage() {
  const [playlists, ramas] = await Promise.all([getPublicPlaylists(), getBranches()]);
  return (
    <div className="flex flex-col gap-2">
      <section>
        <h2 className="text-xl font-semibold">Popular Playlists</h2>
        <ScrollArea className="max-w-full rounded-md">
          <AlbumList playlists={playlists} grid />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
      <hr />
      <section>
        <h2 className="text-xl font-semibold">Playlists por Rama</h2>
        <ScrollArea className="max-w-full rounded-md">
          <RamaList ramas={ramas} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}
