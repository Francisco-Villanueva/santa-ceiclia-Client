import { isChord, isChordLine } from "./chord";

const TAB_SIZE = 4;
const SECTION_LABEL =
  /^\s*(intro|puente|estribillo|coro|solo|interludio|final|outro|verso|pre-?coro)(\s*:)?\s+(.+)$/i;

function expandTabs(line: string) {
  let out = "";
  for (const ch of line) {
    out += ch === "\t" ? " ".repeat(TAB_SIZE - (out.length % TAB_SIZE)) : ch;
  }
  return out.replace(/\r$/, "");
}

/** "Intro: G D G" → "Intro: [G] [D] [G]"; null si la línea no es de ese tipo. */
function convertLabeledChordLine(line: string) {
  const m = SECTION_LABEL.exec(line);
  if (!m) return null;
  const tokens = m[3].trim().split(/\s+/);
  if (!tokens.every(isChord)) return null;
  return `${m[1]}${m[2] ? ":" : ""} ${tokens.map((t) => `[${t}]`).join(" ")}`;
}

const isLabeledChordLine = (line: string) => convertLabeledChordLine(line) !== null;

/** Inserta cada acorde de `chordLine` en la columna correspondiente de `lyric`. */
function mergeChordsIntoLyric(chordLine: string, lyric: string) {
  const marks: { col: number; chord: string }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(chordLine))) marks.push({ col: m.index, chord: m[0] });

  const textEnd = lyric.trimEnd().length;
  const inside = marks.filter((mark) => mark.col < textEnd);
  const trailing = marks.filter((mark) => mark.col >= textEnd);

  let result = lyric;
  // De derecha a izquierda para que insertar no corra las columnas pendientes.
  for (let i = inside.length - 1; i >= 0; i--) {
    const { col, chord } = inside[i];
    result = `${result.slice(0, col)}[${chord}]${result.slice(col)}`;
  }
  // Los que caen después del final de la letra van pegados, sin el relleno de espacios.
  return trailing.reduce((acc, { chord }) => `${acc.trimEnd()} [${chord}]`, result);
}

/**
 * Convierte el cifrado clásico (acordes en una línea sobre la letra, alineados por columna)
 * a ChordPro. Los tabs se expanden a 4 columnas, así que en letras con tabs la posición de
 * los acordes es aproximada.
 */
export function convertChordsOverLyrics(text: string) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").map(expandTabs);
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const labeled = convertLabeledChordLine(line);
    if (labeled) {
      out.push(labeled);
      continue;
    }

    if (!isChordLine(line)) {
      out.push(line.trimEnd());
      continue;
    }

    const next = lines[i + 1];
    const nextIsLyric =
      next !== undefined && next.trim() !== "" && !isChordLine(next) && !isLabeledChordLine(next);
    if (nextIsLyric) {
      out.push(mergeChordsIntoLyric(line, next).trimEnd());
      i++; // la línea de letra ya quedó consumida
    } else {
      // Acordes sin letra debajo (intro, puente, final instrumental).
      out.push(line.trim().split(/\s+/).map((c) => `[${c}]`).join(" "));
    }
  }
  return out.join("\n");
}
