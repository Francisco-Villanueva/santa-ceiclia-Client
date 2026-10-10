// Convierte a ChordPro las letras guardadas en cifrado clásico (acordes sobre la letra).
//   npm run db:convert-lyrics            → simulación: muestra el resultado sin escribir
//   npm run db:convert-lyrics -- --apply → guarda los cambios
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { convertChordsOverLyrics } from "../src/lib/chords";
import { detectChords } from "../src/lib/lyrics";

config({ path: ".env.local" });
config();

const apply = process.argv.includes("--apply");
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  }),
});

async function main() {
  const rows = await prisma.songLyrics.findMany({
    where: { format: "CHORDS_OVER_LYRICS" },
    include: { song: { select: { title: true } } },
    orderBy: { songId: "asc" },
  });
  console.log(`${rows.length} letras en cifrado clásico${apply ? "" : " (simulación)"}`);

  for (const row of rows) {
    const content = convertChordsOverLyrics(row.content);
    console.log(`\n[${row.songId}] ${row.song.title}`);
    if (!apply) console.log(content.split("\n").slice(0, 12).join("\n"));
    else {
      await prisma.songLyrics.update({
        where: { songId: row.songId },
        data: { content, format: "CHORDPRO", hasChords: detectChords(content, "CHORDPRO") },
      });
      console.log("  convertida");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
