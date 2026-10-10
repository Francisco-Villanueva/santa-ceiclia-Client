export type LyricsFormat = "CHORDPRO" | "CHORDS_OVER_LYRICS";

export type SongAudioType = {
  id: string;
  kind: "FILE" | "YOUTUBE";
  /** URL reproducible; null si es un archivo y el storage público no está configurado. */
  url: string | null;
};

export type SongType = {
  id: number;
  title: string;
  year: number;
  authorId: string;
  author: string;
  /** Id de la rama cuando el autor es una rama; null si es persona, grupo u otro. */
  branchId: string | null;
  festivalId: string | null;
  place: string | null;
  lyrics: string | null;
  lyricsFormat: LyricsFormat | null;
  hasChords: boolean;
  /** Tono en el que está escrita la letra (ej. "Am"), si se cargó. */
  originalKey: string | null;
  /** URL reproducible del primer audio disponible. */
  sound: string | null;
  audios: SongAudioType[];
};
