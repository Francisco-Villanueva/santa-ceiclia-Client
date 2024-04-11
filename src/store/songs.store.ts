import { SongType } from "@/types";
import { create } from "zustand";

interface ISongsState {
  songs: SongType[] | null;
  songPlaying: SongType | null;
  setSongs: (songs: SongType[]) => void;
  handlePlaySong: (song: SongType) => void;
  isPlaying: boolean;
  togglePlaying: () => void;
  stopPlaying: () => void;
  sideBarStatus: boolean;
  togglesideBarStatus: () => void;
}
export const songStore = create<ISongsState>((set) => ({
  sideBarStatus: true,
  togglesideBarStatus: () =>
    set(({ sideBarStatus }) => ({ sideBarStatus: !sideBarStatus })),
  songs: null,
  songPlaying: null,
  isPlaying: false,
  togglePlaying: () => set(({ isPlaying }) => ({ isPlaying: !isPlaying })),
  setSongs: (songs) => set(() => ({ songs })),
  handlePlaySong: (song: SongType) =>
    set(({ songPlaying, isPlaying }) => {
      if (song.id === songPlaying?.id) {
        return { isPlaying: !isPlaying };
      }
      return { songPlaying: song, isPlaying: true };
    }),
  stopPlaying: () =>
    set(() => {
      return { songPlaying: null, isPlaying: false };
    }),
}));
