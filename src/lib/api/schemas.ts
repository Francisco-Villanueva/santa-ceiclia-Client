import { z } from "zod";
import { AUDIO_MAX_BYTES, AUDIO_TYPES } from "@/lib/storage";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).nullish();

export const songCreateSchema = z.object({
  title: text(200),
  year: z.number().int().min(1800).max(new Date().getFullYear() + 1),
  authorId: z.string().min(1),
  festivalId: z.string().min(1).nullish(),
  place: optionalText(200),
});
export const songUpdateSchema = songCreateSchema.partial();

export const lyricsSchema = z.object({
  content: z.string().min(1).max(50_000),
  format: z.enum(["CHORDPRO", "CHORDS_OVER_LYRICS"]),
  originalKey: optionalText(10),
});

export const audioSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("YOUTUBE"),
    url: z.string().url().refine((u) => u.startsWith("https://"), "Debe ser https"),
  }),
  z.object({
    kind: z.literal("FILE"),
    storageKey: z.string().regex(/^\d+\/[\w-]+\.\w+$/, "storageKey inválida"),
  }),
]);

export const audioUploadSchema = z.object({
  mimeType: z.string().refine((t) => t in AUDIO_TYPES, "Formato de audio no soportado"),
  sizeBytes: z.number().int().positive().max(AUDIO_MAX_BYTES, "El archivo supera 50 MB"),
});

export const authorTypeSchema = z.enum(["BRANCH", "PERSON", "GROUP", "OTHER"]);
export const authorCreateSchema = z.object({
  name: text(120),
  type: authorTypeSchema,
  branchId: z.string().min(1).nullish(),
});
export const authorUpdateSchema = authorCreateSchema.partial();

export const festivalCreateSchema = z.object({
  year: z.number().int().min(1800).max(new Date().getFullYear() + 1),
  place: optionalText(200),
  winnerBranchId: z.string().min(1).nullish(),
});
export const festivalUpdateSchema = festivalCreateSchema.partial();
