import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeNotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
      <div className="relative h-32 aspect-square">
        <Image src="/noData.jpg" alt="" fill sizes="128px" className="rounded-lg object-cover" />
      </div>
      <h2 className="text-xl font-semibold">No encontramos lo que buscabas</h2>
      <Button asChild variant="outline">
        <Link href="/home">Volver al inicio</Link>
      </Button>
    </div>
  );
}
