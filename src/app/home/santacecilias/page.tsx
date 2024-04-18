"use client";

import { ToggleRamas } from "@/common";
import RamaImage from "@/components/rama/RamaImage";
import { Button } from "@/components/ui/button";
import { ramaStore } from "@/store";
import { santacecliaStore } from "@/store/santacecilias.store";
import { RamaType, SantaCeciliaTpye } from "@/types";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function SantaCard({ santa }: { santa: SantaCeciliaTpye }) {
  const { ramas } = ramaStore();

  const selectedRama = ramas.filter((f) => f.id === santa.winner)[0];
  return (
    <div className="flex  gap-2 items-center px-4 transition-all duration-200 hover:bg-accent rounded-lg">
      <div className="relative w-16 aspect-square">
        {santa.winner ? (
          <RamaImage rama={selectedRama} />
        ) : (
          <Image
            src="/muscial.webp"
            alt={"santa cecilia"}
            fill
            objectFit="contain"
          />
        )}
      </div>
      <div className="flex justify-between flex-grow">
        <span className="font-semibold">{santa.place}</span>
        <span className="text-xs font-bold">{santa.year}</span>
      </div>
    </div>
  );
}
export default function Page() {
  const { santacecilias, santasFilter } = santacecliaStore();
  const [order, setOrder] = useState<"A-Z" | "Z-A">("Z-A");
  const [sortedSantas, setSantas] = useState<SantaCeciliaTpye[]>(santacecilias);

  const handleOrder = () => {
    if (order === "A-Z") {
      setSantas(santacecilias.sort((a, b) => a.year - b.year));
      setOrder("Z-A");
    } else {
      setSantas(santacecilias.sort((a, b) => b.year - a.year));
      setOrder("A-Z");
    }
  };

  const santasToShow = santasFilter.length
    ? santacecilias.filter((santa) => santasFilter.includes(santa.winner))
    : santacecilias;

  return (
    <div className="flex flex-col gap-2 h-full">
      <section className="">
        <div className="flex flex-col  items-start gap-1 text-sm">
          <span className="font-bold text-xl">
            La historia que tanto nos representa
          </span>
          <p>Lista de todos los Santa Cecilias de nuestra comunidad</p>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <ToggleRamas />
        <Button size="sm" variant={"outline"} onClick={handleOrder}>
          {order === "Z-A" ? (
            <ArrowBigDownIcon color="#818181" />
          ) : (
            <ArrowBigUpIcon />
          )}
          {order}
        </Button>
      </div>
      <hr />
      <div className="overflow-auto max-h-[85%] flex-grow flex flex-col gap-2  ">
        {santasToShow.map((santa) => (
          <SantaCard santa={santa} key={santa.id} />
        ))}
      </div>
    </div>
  );
}
