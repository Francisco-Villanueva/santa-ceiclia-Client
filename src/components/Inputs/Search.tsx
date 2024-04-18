import { SearchIcon } from "lucide-react";

export function SearchInput() {
  return (
    <div className="flex items-center gap-2 relative">
      <div className="absolute p-2">
        <SearchIcon />
      </div>
      <input
        type="text"
        className="p-2 pl-10 rounded-lg border text-xs focus:outline-none  "
        placeholder="Search"
      />
    </div>
  );
}
