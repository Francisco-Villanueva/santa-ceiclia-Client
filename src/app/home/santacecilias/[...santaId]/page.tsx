"use client";
import { RamaBadge } from "@/common";
import { SantaSongsList } from "@/components";
import { ramaStore, santacecliaStore } from "@/store";
import { SantaCeciliaTpye } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SantaPage() {
  const { santaId } = useParams();
  const { santacecilias } = santacecliaStore();
  const { ramas } = ramaStore();

  const [santa, setSanta] = useState<SantaCeciliaTpye>();

  useEffect(() => {
    const santa = santacecilias.filter((s) => s.id === santaId[0])[0];

    setSanta(santa);
  }, [santaId]);

  const ramaWinner = ramas?.filter((r) => r.id === santa?.winner)[0];

  return santa ? (
    <div className="flex flex-col gap-4  h-full ">
      <header className="flex gap-4 ">
        <div className="relative h-40 max-md:h-32 aspect-square">
          <Image
            src={"/covers/santas/cover1.jpg"}
            alt="santacecilia"
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl">{santa.place} </h2>
            <span className="text-gray-500"> - </span>
            <h2 className="text-xl text-gray-500">{santa.year}</h2>
          </div>
          <section className="flex flex-col gap-1 p-2 text-sm ">
            <span className="font-light">
              Ganadora: <RamaBadge rama={ramaWinner?.name} />
            </span>
            <span className="font-light">
              Mejor Letra: <RamaBadge rama={ramaWinner?.name} />
            </span>
          </section>
        </div>
      </header>

      <section className="flex-grow flex flex-col h-1/6">
        <div className=" flex-grow  max-h-full overflow-auto">
          {santa.songs.length ? (
            <SantaSongsList songs={santa.songs} />
          ) : (
            <div className="h-full  flex flex-col justify-center items-center text-gray-400  ">
              <div className="relative h-40 aspect-square">
                <Image
                  src={"/noData.jpg"}
                  alt="santacecilia"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              No se encontraron las canciones
            </div>
          )}
        </div>
      </section>
    </div>
  ) : null;
}
