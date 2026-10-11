"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMaster } from "@/components/auth/SessionProvider";

export function NewSongButton() {
  const isMaster = useIsMaster();
  if (!isMaster) return null;
  return (
    <Button size="sm" asChild>
      <Link href="/home/songs/new">Nueva canción</Link>
    </Button>
  );
}
