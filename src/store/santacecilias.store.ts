import { SantaCeciliaTpye } from "@/types";
import { create } from "zustand";

interface ISantaState {
  santacecilias: SantaCeciliaTpye[];
  setSantacecilias: (santas: SantaCeciliaTpye[]) => void;
  santasFilter: string[];
  handleSantasFilter: (filter: string) => void;
}

export const santacecliaStore = create<ISantaState>((set) => ({
  santacecilias: [],
  santasFilter: [],
  setSantacecilias: (santacecilias) => set(() => ({ santacecilias })),
  handleSantasFilter: (newfilter) =>
    set(({ santasFilter }) => {
      if (santasFilter.some((f) => f == newfilter)) {
        santasFilter = santasFilter.filter((f) => f !== newfilter);
      } else {
        santasFilter.push(newfilter);
      }

      return { santasFilter };
    }),
}));
