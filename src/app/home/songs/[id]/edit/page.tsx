"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MasterGate } from "@/components/auth/MasterGate";
import { SongEditor } from "@/components/songs/editor/SongEditor";
import { SongService } from "@/services/song.services";
import type { SongType } from "@/types";

export default function EditSongPage() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<SongType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se pide la canción completa y no la de la lista: el editor necesita los audios con su id.
    SongService.getById(Number(id))
      .then(setSong)
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudo cargar la canción"));
  }, [id]);

  return (
    <MasterGate>
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : song ? (
        <SongEditor key={song.id} song={song} />
      ) : (
        <p className="text-sm text-gray-500">Cargando...</p>
      )}
    </MasterGate>
  );
}
