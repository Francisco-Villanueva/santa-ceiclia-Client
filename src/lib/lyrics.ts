import { convertChordsOverLyrics } from "./chords/convert";

export type LyricsFormat = "CHORDPRO" | "CHORDS_OVER_LYRICS";

/** ¿La letra trae acordes embebidos según su formato? */
export function detectChords(content: string, format: LyricsFormat) {
  const chordpro = format === "CHORDPRO" ? content : convertChordsOverLyrics(content);
  return /\[[A-G][^\]]*\]/.test(chordpro);
}
