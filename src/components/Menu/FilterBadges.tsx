import { RamaBadge } from "@/common/rama/RamaBadge";
import { RamaType } from "@/types";

export function FilterBadges({ ramas, selected }: { ramas: RamaType[]; selected: RamaType["id"][] }) {
  return (
    <div className="flex items-center gap-1">
      {ramas
        .filter((rama) => selected.includes(rama.id))
        .map((rama) => (
          <RamaBadge rama={rama.name} key={rama.id} />
        ))}
    </div>
  );
}
