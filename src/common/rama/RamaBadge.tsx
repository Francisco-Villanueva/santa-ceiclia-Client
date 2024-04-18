import { Badge } from "@/components/ui/badge";
import { RamaType } from "@/types";
import React from "react";

export function RamaBadge({ rama }: { rama: RamaType["name"] }) {
  return (
    <Badge variant="secondary" className="select-none">
      {rama}
    </Badge>
  );
}
