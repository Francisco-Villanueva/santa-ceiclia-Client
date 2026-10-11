import { RamaType } from "@/types";
import RamaImage from "./RamaImage";

export function RamaList({ ramas }: { ramas: RamaType[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
      {ramas.map((rama) => (
        <div key={rama.id} className="flex flex-col gap-2 items-center hover:bg-accent">
          <div className="relative w-20 aspect-square">
            <RamaImage rama={rama} />
          </div>
          <div>{rama.name}</div>
        </div>
      ))}
    </div>
  );
}
