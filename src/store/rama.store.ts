import { RamaType } from "@/types";
import { create } from "zustand";

interface IRamaState {
  ramas: RamaType[];
  setRamas: (santas: RamaType[]) => void;
}

export const ramaStore = create<IRamaState>((set) => ({
  ramas: [],
  setRamas: (ramas) => set(() => ({ ramas })),
}));
