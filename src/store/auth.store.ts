import { CurrentUser } from "@/types";
import { create } from "zustand";

interface IAuthState {
  user: CurrentUser | null;
  status: "loading" | "ready";
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const authStore = create<IAuthState>((set) => ({
  user: null,
  status: "loading",
  fetchMe: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      set({ user: res.ok ? await res.json() : null, status: "ready" });
    } catch {
      set({ user: null, status: "ready" });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));

export const useIsMaster = () => authStore((s) => s.user?.role === "MASTER");
