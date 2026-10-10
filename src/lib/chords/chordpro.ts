import { transposeChord } from "./chord";

export type ChordSegment = {
  /** Acorde que suena justo antes de `text`; null si el tramo no tiene acorde. */
  chord: string | null;
  text: string;
};

const CHORD_MARK = /\[([^\]]*)\]/g;

/** "Cuando [Am]sale la [G]luna" → [{null,"Cuando "},{Am,"sale la "},{G,"luna"}] */
export function parseChordProLine(line: string): ChordSegment[] {
  const segments: ChordSegment[] = [];
  const push = (chord: string | null, text: string) => {
    if (chord !== null || text !== "") segments.push({ chord, text });
  };

  const re = new RegExp(CHORD_MARK.source, "g");
  let pending: string | null = null;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    push(pending, line.slice(last, m.index));
    pending = m[1].trim();
    last = m.index + m[0].length;
  }
  push(pending, line.slice(last));
  return segments;
}

export function parseChordPro(content: string): ChordSegment[][] {
  return content.replace(/\r\n?/g, "\n").split("\n").map(parseChordProLine);
}

/** Línea con acordes pero sin texto cantado (ej. "[G] [D] [C]"). */
export function isChordOnlyLine(segments: ChordSegment[]) {
  return (
    segments.some((s) => s.chord !== null) &&
    segments.every((s) => s.text.trim() === "")
  );
}

/** Letra sin acordes; las líneas que solo tenían acordes se descartan. */
export function stripChords(content: string) {
  return parseChordPro(content)
    .filter((segments) => !isChordOnlyLine(segments))
    .map((segments) => segments.map((s) => s.text).join("").trimEnd())
    .join("\n");
}

/** Transpone todos los acordes entre corchetes; lo que no sea un acorde queda igual. */
export function transposeChordPro(content: string, semitones: number) {
  if (semitones % 12 === 0) return content;
  return content.replace(CHORD_MARK, (_all, chord: string) => `[${transposeChord(chord.trim(), semitones)}]`);
}
