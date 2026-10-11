"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChordSheet } from "@/components/lyrics/ChordSheet";
import { convertChordsOverLyrics } from "@/lib/chords";
import { detectChords } from "@/lib/lyrics";
import { SongService } from "@/services/song.services";
import type {
  AuthorType,
  LyricsFormat,
  RamaType,
  SantaCeciliaType,
  SongAudioType,
  SongType,
} from "@/types";
import { AuthorPicker } from "./AuthorPicker";

const inputClass = "p-2 rounded-lg border bg-background text-sm focus:outline-none w-full";
const labelClass = "flex flex-col gap-1 text-sm";

const AUDIO_ACCEPT = "audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/x-wav,audio/ogg,audio/webm";
const AUDIO_MAX_BYTES = 50 * 1024 * 1024;

type Props = {
  song?: SongType;
  authors: AuthorType[];
  festivals: SantaCeciliaType[];
  ramas: RamaType[];
};

export function SongEditor({ song, authors: initialAuthors, festivals, ramas }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  // Si la creación sale bien pero falla un paso posterior, los reintentos actualizan esta
  // canción en vez de crear otra.
  const [songId, setSongId] = useState<number | undefined>(song?.id);
  const [title, setTitle] = useState(song?.title ?? "");
  const [year, setYear] = useState(String(song?.year ?? new Date().getFullYear()));
  const [authorId, setAuthorId] = useState(song?.authorId ?? "");
  const [festivalId, setFestivalId] = useState(song?.festivalId ?? "");
  const [place, setPlace] = useState(song?.place ?? "");

  const [lyrics, setLyrics] = useState(song?.lyrics ?? "");
  const [format, setFormat] = useState<LyricsFormat>(song?.lyricsFormat ?? "CHORDPRO");
  const [originalKey, setOriginalKey] = useState(song?.originalKey ?? "");
  const [lyricsOnServer, setLyricsOnServer] = useState(Boolean(song?.lyrics));

  const [audios, setAudios] = useState<SongAudioType[]>(song?.audios ?? []);
  const [removedAudioIds, setRemovedAudioIds] = useState<string[]>([]);
  const [newUrls, setNewUrls] = useState<string[]>([]);
  const [urlDraft, setUrlDraft] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [authors, setAuthors] = useState(initialAuthors);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertChord() {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    // Con texto seleccionado lo encierra entre corchetes; sin selección deja el cursor adentro.
    setLyrics(`${lyrics.slice(0, start)}[${lyrics.slice(start, end)}]${lyrics.slice(end)}`);
    const caret = start === end ? start + 1 : end + 2;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  function convertToChordPro() {
    setLyrics(convertChordsOverLyrics(lyrics));
    setFormat("CHORDPRO");
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url.startsWith("https://")) return setError("El link de audio debe empezar con https://");
    setError(null);
    setNewUrls((urls) => [...urls, url]);
    setUrlDraft("");
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = AUDIO_ACCEPT.split(",");
    for (const file of Array.from(list)) {
      if (!accepted.includes(file.type)) {
        return setError(`"${file.name}": formato no soportado (mp3, m4a, aac, wav, ogg o webm)`);
      }
      if (file.size > AUDIO_MAX_BYTES) return setError(`"${file.name}" supera los 50 MB`);
    }
    setError(null);
    setNewFiles((files) => [...files, ...Array.from(list)]);
  }

  function validate() {
    const y = Number(year);
    if (!title.trim()) return "El título es obligatorio";
    if (!Number.isInteger(y) || y < 1800 || y > new Date().getFullYear() + 1) {
      return "El año no es válido";
    }
    if (!authorId) return "Elegí un autor";
    return null;
  }

  async function save() {
    const problem = validate();
    if (problem) return setError(problem);
    setError(null);
    setSaving(true);

    let id = songId;
    try {
      const data = {
        title: title.trim(),
        year: Number(year),
        authorId,
        festivalId: festivalId || null,
        place: place.trim() || null,
      };
      id = (id ? await SongService.update(id, data) : await SongService.create(data)).id;
      setSongId(id);

      if (lyrics.trim()) {
        await SongService.saveLyrics(id, {
          content: lyrics,
          format,
          originalKey: originalKey.trim() || null,
        });
        setLyricsOnServer(true);
        // El servidor guarda siempre ChordPro: se refleja en el formulario.
        if (format === "CHORDS_OVER_LYRICS") convertToChordPro();
      } else if (lyricsOnServer) {
        await SongService.removeLyrics(id);
        setLyricsOnServer(false);
      }

      for (const audioId of removedAudioIds) {
        await SongService.removeAudio(id, audioId);
        setAudios((list) => list.filter((a) => a.id !== audioId));
        setRemovedAudioIds((ids) => ids.filter((x) => x !== audioId));
      }
      for (const url of newUrls) {
        const updated = await SongService.addYoutube(id, url);
        setAudios(updated.audios);
        setNewUrls((urls) => urls.filter((u) => u !== url));
      }

      for (const file of newFiles) {
        const updated = await SongService.uploadAudio(id, file);
        setAudios(updated.audios);
        setNewFiles((files) => files.filter((f) => f !== file));
      }

      toast({ description: `"${title.trim()}" guardada`, duration: 2000 });
      leave();
    } catch (e) {
      const detail = e instanceof Error ? e.message : "Error desconocido";
      setError(
        id && !song?.id
          ? `La canción se creó, pero falló un paso posterior: ${detail}. Volvé a guardar para reintentarlo.`
          : detail,
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!songId) return;
    if (!window.confirm(`¿Eliminar "${title}"? También se borran su letra y sus audios.`)) return;
    setSaving(true);
    try {
      await SongService.remove(songId);
      toast({ description: `"${title}" eliminada`, duration: 2000 });
      leave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar");
      setSaving(false);
    }
  }

  // Las listas son Server Components: refresh vuelve a pedirlas con los cambios recién guardados.
  function leave() {
    router.push("/home/songs");
    router.refresh();
  }

  const visibleAudios = audios.filter((a) => !removedAudioIds.includes(a.id));
  const sortedFestivals = festivals.toSorted((a, b) => b.year - a.year);

  return (
    <div className="flex flex-col gap-6 select-text pb-8">
      <h1 className="text-xl font-bold">{song?.id ? "Editar canción" : "Nueva canción"}</h1>

      <section className="grid gap-4 md:grid-cols-2">
        <label className={`${labelClass} md:col-span-2`}>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Año
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Lugar (opcional)
          <input value={place} onChange={(e) => setPlace(e.target.value)} className={inputClass} />
        </label>
        <div className={labelClass}>
          Autor
          <AuthorPicker
            authors={authors}
            ramas={ramas}
            value={authorId}
            onChange={setAuthorId}
            onCreated={(a) => setAuthors((list) => [...list, a])}
          />
        </div>
        <label className={labelClass}>
          Santa Cecilia (opcional)
          <select
            value={festivalId}
            onChange={(e) => setFestivalId(e.target.value)}
            className={inputClass}
          >
            <option value="">Ninguna</option>
            {sortedFestivals.map((f) => (
              <option key={f.id} value={f.id}>
                {f.year}
                {f.place ? ` — ${f.place}` : ""}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Letra y acordes</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as LyricsFormat)}
              className="p-1.5 rounded-lg border bg-background text-sm"
              aria-label="Formato de la letra"
            >
              <option value="CHORDPRO">ChordPro: Cuando [Am]sale</option>
              <option value="CHORDS_OVER_LYRICS">Acordes sobre la letra</option>
            </select>
            {format === "CHORDS_OVER_LYRICS" && (
              <Button type="button" size="sm" variant="outline" onClick={convertToChordPro}>
                Convertir a ChordPro
              </Button>
            )}
            <Button type="button" size="sm" variant="outline" onClick={insertChord}>
              Insertar acorde [ ]
            </Button>
            <input
              value={originalKey}
              onChange={(e) => setOriginalKey(e.target.value)}
              placeholder="Tono (ej. Am)"
              maxLength={10}
              className="p-1.5 rounded-lg border bg-background text-sm w-28"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Escribí cada acorde entre corchetes, justo antes de la sílaba donde suena. Al guardar, el
          formato &quot;acordes sobre la letra&quot; se convierte a ChordPro.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <textarea
            ref={textareaRef}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            spellCheck={false}
            placeholder={"Cuando [Am]sale la [G]luna\nsobre el [C]campamento"}
            className="p-3 rounded-lg border bg-background font-mono text-sm h-[50vh] resize-y focus:outline-none whitespace-pre"
          />
          <div className="p-3 rounded-lg border h-[50vh] overflow-auto bg-accent">
            {lyrics.trim() ? (
              <ChordSheet content={lyrics} format={format} showChords transpose={0} singleColumn />
            ) : (
              <p className="text-sm text-gray-500">La vista previa aparece acá.</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Acordes detectados: {lyrics.trim() && detectChords(lyrics, format) ? "sí" : "no"}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Audio</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {visibleAudios.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-2">
              <span className="truncate">{a.url ?? "Archivo subido"}</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setRemovedAudioIds((ids) => [...ids, a.id])}
              >
                Quitar
              </Button>
            </li>
          ))}
          {newUrls.map((url) => (
            <li key={url} className="flex items-center justify-between gap-2">
              <span className="truncate">{url} (nuevo)</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setNewUrls((urls) => urls.filter((u) => u !== url))}
              >
                Quitar
              </Button>
            </li>
          ))}
          {newFiles.map((file) => (
            <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-2">
              <span className="truncate">
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB, se sube al guardar)
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setNewFiles((files) => files.filter((f) => f !== file))}
              >
                Quitar
              </Button>
            </li>
          ))}
          {visibleAudios.length === 0 && newUrls.length === 0 && newFiles.length === 0 && (
            <li className="text-gray-500">Sin audio.</li>
          )}
        </ul>
        <div className="flex gap-2">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputClass}
          />
          <Button type="button" variant="outline" onClick={addUrl} disabled={!urlDraft.trim()}>
            Agregar
          </Button>
        </div>
        <label className={labelClass}>
          O subí un archivo de audio (mp3, m4a, wav, ogg · máx. 50 MB)
          <input
            type="file"
            accept={AUDIO_ACCEPT}
            multiple
            disabled={saving}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
            className="text-sm file:mr-3 file:rounded-lg file:border file:bg-background file:px-3 file:py-1.5 file:text-sm"
          />
        </label>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
            Cancelar
          </Button>
        </div>
        {songId && (
          <Button type="button" variant="destructive" onClick={remove} disabled={saving}>
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
}
