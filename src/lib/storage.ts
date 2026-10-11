import "server-only";
import { randomUUID } from "crypto";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const AUDIO_BUCKET = "songs";
export const AUDIO_MAX_BYTES = 50 * 1024 * 1024;

export const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};

const globalForS3 = globalThis as unknown as { s3?: S3Client };

function client() {
  return (globalForS3.s3 ??= new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    // Sin esto las URLs prefirmadas de PUT llevan un checksum de body vacío y rechazan el archivo.
    requestChecksumCalculation: "WHEN_REQUIRED",
  }));
}

export const newAudioKey = (songId: number, mimeType: string) =>
  `${songId}/${randomUUID()}.${AUDIO_TYPES[mimeType]}`;

/** URL de subida directa desde el navegador; firma el tamaño y el tipo exactos. */
export function presignAudioUpload(key: string, mimeType: string, sizeBytes: number) {
  return getSignedUrl(
    client(),
    new PutObjectCommand({
      Bucket: AUDIO_BUCKET,
      Key: key,
      ContentType: mimeType,
      ContentLength: sizeBytes,
    }),
    { expiresIn: 300 },
  );
}

/** Metadatos del objeto subido, o null si todavía no existe. */
export async function headAudio(key: string) {
  try {
    const r = await client().send(new HeadObjectCommand({ Bucket: AUDIO_BUCKET, Key: key }));
    return { sizeBytes: r.ContentLength ?? 0, mimeType: r.ContentType ?? null };
  } catch {
    return null;
  }
}

export async function deleteAudio(key: string) {
  await client().send(new DeleteObjectCommand({ Bucket: AUDIO_BUCKET, Key: key }));
}
