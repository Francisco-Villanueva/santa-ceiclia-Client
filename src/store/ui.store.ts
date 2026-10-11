import { create } from "zustand";

interface UiState {
  sideBarOpen: boolean;
  toggleSideBar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sideBarOpen: true,
  toggleSideBar: () => set((s) => ({ sideBarOpen: !s.sideBarOpen })),
}));
