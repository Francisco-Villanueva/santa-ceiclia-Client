import { create } from "zustand";
import type { PlayListType, SongType } from "@/types";

// Estado del reproductor. Los datos (canciones, festivales, ramas) los cargan las páginas en el
// servidor; acá solo vive lo que cambia en el navegador mientras se escucha.
interface PlayerState {
  songPlaying: SongType | null;
  isPlaying: boolean;
  queue: SongType[];
  /** Playlist que originó la cola actual, si la hay. */
  playlistPlayingId: PlayListType["id"] | null;
  /** Avance de la canción actual, de 0 a 100. */
  progress: number;

  /** Reproduce la canción; si ya es la actual, alterna play/pausa. La suma a la cola. */
  play: (song: SongType) => void;
  playPlaylist: (playlist: PlayListType) => void;
  togglePlaying: () => void;
  addToQueue: (song: SongType) => void;
  removeFromQueue: (song: SongType) => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  setProgress: (progress: number) => void;
}

const withSong = (queue: SongType[], song: SongType) =>
  queue.some((s) => s.id === song.id) ? queue : [...queue, song];

/** Canción a `offset` posiciones de la actual dentro de la cola, dando la vuelta en los extremos. */
function stepInQueue(queue: SongType[], current: SongType | null, offset: number) {
  if (!queue.length) return current;
  const index = current ? queue.findIndex((s) => s.id === current.id) : -1;
  if (index === -1) return queue[0];
  return queue[(index + offset + queue.length) % queue.length];
}

export const usePlayerStore = create<PlayerState>((set) => ({
  songPlaying: null,
  isPlaying: false,
  queue: [],
  playlistPlayingId: null,
  progress: 0,

  play: (song) =>
    set((s) =>
      s.songPlaying?.id === song.id
        ? { isPlaying: !s.isPlaying }
        : { songPlaying: song, isPlaying: true, progress: 0, queue: withSong(s.queue, song) },
    ),
  playPlaylist: (playlist) =>
    set((s) => {
      const playable = playlist.songs.filter((song) => song.sound);
      if (s.playlistPlayingId === playlist.id) return { isPlaying: !s.isPlaying };
      if (!playable.length) return {};
      return {
        playlistPlayingId: playlist.id,
        queue: playable,
        songPlaying: playable[0],
        isPlaying: true,
        progress: 0,
      };
    }),
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
  addToQueue: (song) => set((s) => ({ queue: withSong(s.queue, song) })),
  removeFromQueue: (song) => set((s) => ({ queue: s.queue.filter((x) => x.id !== song.id) })),
  next: () =>
    set((s) => ({ songPlaying: stepInQueue(s.queue, s.songPlaying, 1), isPlaying: true, progress: 0 })),
  prev: () =>
    set((s) => ({ songPlaying: stepInQueue(s.queue, s.songPlaying, -1), isPlaying: true, progress: 0 })),
  stop: () => set({ songPlaying: null, isPlaying: false, progress: 0 }),
  setProgress: (progress) => set({ progress }),
}));

/** ¿Esta canción es la que está sonando ahora? */
export const useIsSongPlaying = (id: SongType["id"]) =>
  usePlayerStore((s) => s.isPlaying && s.songPlaying?.id === id);
