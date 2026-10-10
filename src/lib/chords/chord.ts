// Nombres de acordes en notación anglosajona (C, Am7, F#m, Bb/D...).

const NOTE_INDEX: Record<string, number> = {
  C: 0, "B#": 0,
  "C#": 1, Db: 1,
  D: 2,
  "D#": 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, "E#": 5,
  "F#": 6, Gb: 6,
  G: 7,
  "G#": 8, Ab: 8,
  A: 9,
  "A#": 10, Bb: 10,
  B: 11, Cb: 11,
};

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
// Para acordes naturales (sin alteración) se usan los nombres más comunes en guitarra.
const COMMON_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export const CHORD_RE =
  /^([A-G][#b]?)((?:m|maj|min|dim|aug|sus|add)?\d*(?:sus\d?|add\d+)?(?:[#b]\d+)*)(?:\/([A-G][#b]?))?$/;

export type ParsedChord = { root: string; suffix: string; bass: string | null };

export function parseChord(text: string): ParsedChord | null {
  const m = CHORD_RE.exec(text);
  return m ? { root: m[1], suffix: m[2], bass: m[3] ?? null } : null;
}

export const isChord = (text: string) => CHORD_RE.test(text);

/** Una línea es "de acordes" si todas sus palabras son acordes (y hay al menos una). */
export function isChordLine(line: string) {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  return tokens.length > 0 && tokens.every(isChord);
}

function namesFor(root: string) {
  if (root.endsWith("b")) return FLAT_NAMES;
  if (root.endsWith("#")) return SHARP_NAMES;
  return COMMON_NAMES;
}

/**
 * Transpone un acorde `semitones` semitonos. Conserva el estilo de alteración del original
 * (bemoles o sostenidos); los acordes naturales usan los nombres más comunes (Eb, Ab, Bb, F#, C#).
 * Si el texto no es un acorde, lo devuelve tal cual.
 */
export function transposeChord(text: string, semitones: number) {
  const chord = parseChord(text);
  if (!chord) return text;
  const names = namesFor(chord.root);
  const shift = (note: string) => names[(((NOTE_INDEX[note] + semitones) % 12) + 12) % 12];
  return shift(chord.root) + chord.suffix + (chord.bass ? `/${shift(chord.bass)}` : "");
}
