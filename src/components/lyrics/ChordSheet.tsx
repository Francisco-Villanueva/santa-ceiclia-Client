"use client";

import { useMemo } from "react";
import {
  convertChordsOverLyrics,
  parseChordPro,
  stripChords,
  transposeChordPro,
} from "@/lib/chords";
import type { LyricsFormat } from "@/types";

type Props = {
  content: string;
  format: LyricsFormat | null;
  showChords: boolean;
  /** Semitonos a transponer (positivo sube, negativo baja). */
  transpose: number;
  /** Una sola columna (vista previa en el editor); por defecto se reparte en dos. */
  singleColumn?: boolean;
};

/**
 * Muestra una letra con cada acorde sobre la sílaba donde suena. La alineación no depende de
 * espacios ni de una tipografía monoespaciada: cada tramo de texto es una columna con su acorde
 * arriba, así que se mantiene con cualquier fuente y ancho de pantalla.
 */
export function ChordSheet({ content, format, showChords, transpose, singleColumn }: Props) {
  const columns = singleColumn ? "" : "columns-2 max-md:columns-1";
  // Las letras legadas (acordes sobre la letra) se convierten al vuelo a ChordPro.
  const chordpro = useMemo(
    () => (format === "CHORDS_OVER_LYRICS" ? convertChordsOverLyrics(content) : content),
    [content, format],
  );

  const lines = useMemo(
    () => (showChords ? parseChordPro(transposeChordPro(chordpro, transpose)) : []),
    [chordpro, showChords, transpose],
  );

  if (!showChords) {
    return (
      <pre className={`font-inter whitespace-pre-wrap text-[15px] max-md:text-[12px] ${columns}`}>
        {stripChords(chordpro)}
      </pre>
    );
  }

  return (
    <div className={`font-inter text-[15px] max-md:text-[12px] ${columns}`}>
      {lines.map((segments, i) => {
        if (segments.length === 0) return <div key={i} className="h-[1.2em]" aria-hidden />;

        if (!segments.some((s) => s.chord)) {
          return (
            <div key={i} className="whitespace-pre-wrap break-inside-avoid">
              {segments.map((s) => s.text).join("")}
            </div>
          );
        }

        return (
          <div key={i} className="flex flex-wrap items-end break-inside-avoid">
            {segments.map((s, j) => (
              <span key={j} className="inline-flex flex-col">
                <span className="pr-2 font-semibold text-primary leading-tight">
                  {s.chord ?? " "}
                </span>
                <span className="whitespace-pre-wrap leading-tight">{s.text || " "}</span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
