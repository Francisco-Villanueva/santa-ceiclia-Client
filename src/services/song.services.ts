import { SongType } from "@/types";
import { apiGet, apiSend } from "./http";

export type SongInput = {
  title: string;
  year: number;
  authorId: string;
  festivalId: string | null;
  place: string | null;
};

export type LyricsInput = {
  content: string;
  format: "CHORDPRO" | "CHORDS_OVER_LYRICS";
  originalKey: string | null;
};

export class SongService {
  static getAllSongs() {
    return apiGet<SongType[]>("/songs");
  }
  static getById(id: SongType["id"]) {
    return apiGet<SongType>(`/songs/${id}`);
  }
  static create(data: SongInput) {
    return apiSend<SongType>("POST", "/songs", data);
  }
  static update(id: SongType["id"], data: Partial<SongInput>) {
    return apiSend<SongType>("PATCH", `/songs/${id}`, data);
  }
  static remove(id: SongType["id"]) {
    return apiSend("DELETE", `/songs/${id}`);
  }
  static saveLyrics(id: SongType["id"], data: LyricsInput) {
    return apiSend<SongType>("PUT", `/songs/${id}/lyrics`, data);
  }
  static removeLyrics(id: SongType["id"]) {
    return apiSend("DELETE", `/songs/${id}/lyrics`);
  }
  static addYoutube(id: SongType["id"], url: string) {
    return apiSend<SongType>("POST", `/songs/${id}/audio`, { kind: "YOUTUBE", url });
  }
  /** Sube el archivo directo al storage con una URL prefirmada y lo registra en la canción. */
  static async uploadAudio(id: SongType["id"], file: File) {
    const { uploadUrl, storageKey, headers } = await apiSend<{
      uploadUrl: string;
      storageKey: string;
      headers: Record<string, string>;
    }>("POST", `/songs/${id}/audio/upload`, { mimeType: file.type, sizeBytes: file.size });

    const res = await fetch(uploadUrl, { method: "PUT", headers, body: file });
    if (!res.ok) throw new Error(`No se pudo subir "${file.name}" (${res.status})`);

    return apiSend<SongType>("POST", `/songs/${id}/audio`, { kind: "FILE", storageKey });
  }
  static removeAudio(id: SongType["id"], audioId: string) {
    return apiSend("DELETE", `/songs/${id}/audio/${audioId}`);
  }
}
