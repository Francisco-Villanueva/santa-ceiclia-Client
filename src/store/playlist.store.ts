import { SongType } from "@/types";
import { PlayListType } from "@/types";
import { create } from "zustand";

interface IPlaylistState {
  playlists: PlayListType[];
  playlistPlaying: PlayListType | null;
  setPlaylistsPlaying: (playlisys: PlayListType) => void;
  setPlaylists: (playlisys: PlayListType[]) => void;
  list: SongType[];
  addToPlaylist: ({
    playlist,
    song,
  }: {
    playlist: PlayListType;
    song: SongType;
  }) => void;
  removeFromPlaylist: ({
    playlist,
    song,
  }: {
    playlist: PlayListType;
    song: SongType;
  }) => void;
}

export const playlistStore = create<IPlaylistState>((set) => ({
  list: [],
  playlists: [],
  playlistPlaying: null,
  setPlaylistsPlaying: (playlistPlaying) => set(() => ({ playlistPlaying })),
  setPlaylists: (playlists) => set(() => ({ playlists })),
  addToPlaylist: ({ playlist, song }) =>
    set((state) => {
      if (!playlist.songs.includes(song)) {
        playlist.songs.push(song);
      }
      return { ...state };
    }),
  removeFromPlaylist: ({ playlist, song }) =>
    set((state) => {
      if (playlist.songs.includes(song)) {
        playlist.songs.filter((s) => s.id !== song.id);
      }
      return { ...state };
    }),
}));
