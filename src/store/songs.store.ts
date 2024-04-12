import { SongType } from "@/types";
import { create } from "zustand";

interface ISongsState {
  songs: SongType[] | null;
  songPlaying: SongType | null;
  selectedSong: SongType | null;
  songsQueue: SongType[];
  addToQueue: (songs: SongType) => void;
  setSongs: (songs: SongType[]) => void;
  setSelectedSong: (song: SongType) => void;
  handlePlaySong: (song: SongType) => void;
  isPlaying: boolean;
  togglePlaying: () => void;
  stopPlaying: () => void;
  sideBarStatus: boolean;
  togglesideBarStatus: () => void;
  nextSong: () => void;
  prevSong: () => void;
  time: {
    duration?: number;
    played?: number;
    progress?: number;
  };
  setTimePlayed: ({
    duration,
    played,
    progress,
  }: {
    duration?: number;
    played?: number;
    progress?: number;
  }) => void;
}

export const songStore = create<ISongsState>((set) => ({
  sideBarStatus: true,
  togglesideBarStatus: () =>
    set(({ sideBarStatus }) => ({ sideBarStatus: !sideBarStatus })),
  songs: null,
  songPlaying: null,
  isPlaying: false,
  songsQueue: [],
  selectedSong: null,
  time: {
    duration: 0,
    played: 0,
    progress: 0,
  },
  setTimePlayed: ({ duration, played, progress }) =>
    set(() => ({ time: { duration, played, progress } })),
  setSelectedSong: (selectedSong) => set(() => ({ selectedSong })),
  togglePlaying: () => set(({ isPlaying }) => ({ isPlaying: !isPlaying })),
  setSongs: (songs) => set(() => ({ songs })),
  addToQueue: (newSong: SongType) =>
    set((state) => {
      const { songsQueue } = state;

      const isNew = songsQueue.some((someSong) => someSong.id === newSong.id);

      if (!isNew) {
        songsQueue.push(newSong);
      }

      return { ...state };
    }),
  handlePlaySong: (song: SongType) =>
    set(({ songPlaying, isPlaying }) => {
      if (song.id === songPlaying?.id) {
        return { isPlaying: !isPlaying };
      }

      return { songPlaying: song, isPlaying: true };
    }),

  nextSong: () =>
    set((state) => {
      const { songsQueue, songPlaying } = state;

      if (songPlaying) {
        let nextSong = songPlaying;
        const currentIndex = songsQueue.indexOf(songPlaying);

        if (currentIndex >= songsQueue.length - 1) {
          nextSong = songsQueue[0];
        } else {
          nextSong = songsQueue[currentIndex + 1];
        }

        return { songPlaying: nextSong, isPlaying: true };
      }

      return { ...state };
    }),
  prevSong: () =>
    set((state) => {
      const { songsQueue, songPlaying } = state;

      if (songPlaying) {
        let nextSong = songPlaying;
        const currentIndex = songsQueue.indexOf(songPlaying);

        if (currentIndex <= songsQueue.length - 1) {
          nextSong = songsQueue[0];
        } else {
          nextSong = songsQueue[currentIndex - 1];
        }

        return { songPlaying: nextSong, isPlaying: true };
      }

      return { ...state };
    }),
  stopPlaying: () =>
    set(() => {
      return { songPlaying: null, isPlaying: false };
    }),
}));
