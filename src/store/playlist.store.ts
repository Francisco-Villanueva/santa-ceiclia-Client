import { SongType } from "@/types";
import { PlayListType } from "@/types";
import { create } from "zustand";

interface IPlaylistState {
  playlists: PlayListType[];
  playlistPlaying: PlayListType | null;
  setPlaylistsPlaying: (playlisys: PlayListType) => void;
  setPlaylists: (playlisys: PlayListType[]) => void;
  list: SongType[];
  addToPlaylist: (song: SongType) => void;
}

export const playlistStore = create<IPlaylistState>((set) => ({
  list: [],
  playlists: [],
  playlistPlaying: null,
  setPlaylistsPlaying: (playlistPlaying) => set(() => ({ playlistPlaying })),
  setPlaylists: (playlists) => set(() => ({ playlists })),
  addToPlaylist: (song) =>
    set((state) => {
      if (!state.list.includes(song)) {
        state.list.push(song);
      }
      return { ...state };
    }),
}));
