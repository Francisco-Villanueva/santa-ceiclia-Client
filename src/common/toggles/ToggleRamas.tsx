"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ramaStore, santacecliaStore } from "@/store";

export function ToggleRamas() {
  const { ramas } = ramaStore();
  const { handleSantasFilter, santasFilter } = santacecliaStore();
  const handleToggle = (e: any) => {
    const newfilter = e.target.name;
    handleSantasFilter(newfilter);
  };
  return (
    <ToggleGroup
      type="multiple"
      variant={"outline"}
      onSubmit={(e: any) => console.log("ON SUBMIT : ", e.target)}
    >
      {ramas.map((rama) => (
        <ToggleGroupItem
          value={rama.id}
          name={rama.id}
          onClick={handleToggle}
          key={rama.id}
        >
          {rama.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
