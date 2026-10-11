"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import { DropdownRamaFilter, FilterBadges } from "@/components/Menu";
import RamaImage from "@/components/rama/RamaImage";
import { Button } from "@/components/ui/button";
import { RamaType, SantaCeciliaType } from "@/types";

function SantaCard({ santa, winner }: { santa: SantaCeciliaType; winner?: RamaType }) {
  const songWinner = santa.songs.find((song) => song.branchId === santa.winner);
  return (
    <Link
      href={`/home/santacecilias/${santa.id}`}
      className="flex gap-2 items-center px-4 transition-all duration-200 hover:bg-accent rounded-lg"
    >
      <div className="relative w-16 aspect-square">
        {winner ? (
          <RamaImage rama={winner} sizes="64px" />
        ) : (
          <Image src="/muscial.webp" alt="" fill sizes="64px" className="object-contain" />
        )}
      </div>
      <div className="flex justify-between flex-grow">
        <div className="flex flex-col">
          <span className="font-semibold">{santa.place}</span>
          <span className="text-xs font-light">
            Cancion: <b>{songWinner?.title}</b>
          </span>
        </div>
        <span className="text-xs font-bold">{santa.year}</span>
      </div>
    </Link>
  );
}

type Props = { santacecilias: SantaCeciliaType[]; ramas: RamaType[] };

export function SantaCeciliasBrowser({ santacecilias, ramas }: Props) {
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [ramaFilter, setRamaFilter] = useState<RamaType["id"][]>([]);

  const toggleRama = (id: RamaType["id"]) =>
    setRamaFilter((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const ramasById = useMemo(() => new Map(ramas.map((r) => [r.id, r])), [ramas]);
  const santasToShow = useMemo(
    () =>
      santacecilias
        .filter((s) => !ramaFilter.length || ramaFilter.includes(s.winner ?? ""))
        .toSorted((a, b) => (order === "desc" ? b.year - a.year : a.year - b.year)),
    [santacecilias, ramaFilter, order],
  );

  return (
    <>
      <div className="flex items-center gap-4 justify-between">
        <div className="max-w-[75%] overflow-auto flex items-center gap-2">
          <DropdownRamaFilter ramas={ramas} selected={ramaFilter} onToggle={toggleRama} />
          <FilterBadges ramas={ramas} selected={ramaFilter} />
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          aria-label={order === "desc" ? "Ordenar de la más vieja a la más nueva" : "Ordenar de la más nueva a la más vieja"}
        >
          {order === "desc" ? <ArrowBigDownIcon color="#818181" /> : <ArrowBigUpIcon />}
          {order === "desc" ? "Z-A" : "A-Z"}
        </Button>
      </div>
      <hr />
      <div className="overflow-auto max-h-[85%] flex-grow flex flex-col gap-2">
        {santasToShow.map((santa) => (
          <SantaCard
            santa={santa}
            winner={santa.winner ? ramasById.get(santa.winner) : undefined}
            key={santa.id}
          />
        ))}
      </div>
    </>
  );
}
