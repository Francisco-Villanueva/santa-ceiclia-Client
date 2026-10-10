"use client";

import { MasterGate } from "@/components/auth/MasterGate";
import { SongEditor } from "@/components/songs/editor/SongEditor";

export default function NewSongPage() {
  return (
    <MasterGate>
      <SongEditor />
    </MasterGate>
  );
}
