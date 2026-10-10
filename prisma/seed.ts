import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { AuthorType, PrismaClient } from "../src/generated/prisma/client";
import ramasJson from "../src/mocks/ramas.json";
import songsJson from "../src/mocks/songs.json";
import santaCeciliasJson from "../src/mocks/santacecilias.json";
import playlistsJson from "../src/mocks/playlists.json";
import { convertChordsOverLyrics } from "../src/lib/chords";
import { detectChords } from "../src/lib/lyrics";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  }),
});

// Autores que no son ramas. El resto de los authorId que coinciden con una rama son BRANCH.
const NON_BRANCH_AUTHORS: Record<string, AuthorType> = {
  id_santigoVall: "PERSON",
  id_francoBostal: "PERSON",
  id_sinTotem: "GROUP",
  id_familias: "GROUP",
  id_santajuana: "OTHER",
  id_cjocomunidad: "OTHER",
};

// scId de canciones que no siguen el patrón sc_<año>.
const FESTIVAL_YEAR_OVERRIDES: Record<string, number> = { sc_ruca: 2003 };

const isPlaceholder = (text: string) => /^`*$/.test(text.trim()) || /^lorem/i.test(text.trim());

const slugOf = (ramaId: string) => ramaId.replace(/^id_/, "").toLowerCase();

async function main() {
  // --- Ramas
  const branchBySlug = new Map<string, string>();
  for (let position = 0; position < ramasJson.ramas.length; position++) {
    const r = ramasJson.ramas[position];
    const slug = slugOf(r.id);
    const branch = await prisma.branch.upsert({
      where: { slug },
      create: { slug, name: r.name, position, logoLight: r.img.light, logoDark: r.img.dark },
      update: { name: r.name, position, logoLight: r.img.light, logoDark: r.img.dark },
    });
    branchBySlug.set(slug, branch.id);
  }

  // --- Autores (se normaliza por authorId en minúsculas: "clan" y "Clan" son el mismo)
  const authorByKey = new Map<string, string>();
  for (const s of songsJson.songs) {
    const key = s.authorId!.toLowerCase();
    if (authorByKey.has(key)) continue;
    const branchId = branchBySlug.get(slugOf(s.authorId!));
    const type: AuthorType = branchId ? "BRANCH" : NON_BRANCH_AUTHORS[s.authorId!] ?? "OTHER";
    const name = branchId
      ? ramasJson.ramas.find((r) => slugOf(r.id) === slugOf(s.authorId!))!.name
      : s.author!;
    const existing = await prisma.author.findFirst({ where: { name, type } });
    const author =
      existing ?? (await prisma.author.create({ data: { name, type, branchId: branchId ?? null } }));
    authorByKey.set(key, author.id);
  }

  // --- Festivales (Santa Cecilia)
  const festivalByYear = new Map<number, string>();
  for (const f of santaCeciliasJson.santacecilias) {
    const winnerBranchId = f.winner ? branchBySlug.get(slugOf(f.winner)) ?? null : null;
    const festival = await prisma.festival.upsert({
      where: { year: f.year },
      create: { year: f.year, place: f.place || null, winnerBranchId },
      update: { place: f.place || null, winnerBranchId },
    });
    festivalByYear.set(f.year, festival.id);
  }

  // --- Usuario MASTER inicial
  const email = process.env.SEED_MASTER_EMAIL;
  const password = process.env.SEED_MASTER_PASSWORD;
  if (!email || !password) throw new Error("Faltan SEED_MASTER_EMAIL / SEED_MASTER_PASSWORD");
  const master = await prisma.user.upsert({
    where: { email },
    create: { email, name: "Master", role: "MASTER", passwordHash: await bcrypt.hash(password, 10) },
    update: { role: "MASTER" },
  });

  // --- Canciones, letras y audios (se conservan los ids originales)
  for (const s of songsJson.songs) {
    const year = parseInt(s.year!, 10);
    const festivalYear =
      FESTIVAL_YEAR_OVERRIDES[s.scId!] ?? parseInt(/^sc_(\d{4})$/.exec(s.scId!)?.[1] ?? "", 10);
    const data = {
      title: s.title,
      year,
      place: s.place || null,
      authorId: authorByKey.get(s.authorId!.toLowerCase())!,
      festivalId: festivalByYear.get(festivalYear) ?? null,
      createdById: master.id,
    };
    await prisma.song.upsert({ where: { id: s.id }, create: { id: s.id, ...data }, update: data });

    if (s.lyrics && !isPlaceholder(s.lyrics)) {
      // Los mocks traen cifrado clásico (acordes sobre la letra); se guarda ya convertido a ChordPro.
      const content = convertChordsOverLyrics(s.lyrics);
      await prisma.songLyrics.upsert({
        where: { songId: s.id },
        create: {
          songId: s.id,
          content,
          format: "CHORDPRO",
          hasChords: detectChords(content, "CHORDPRO"),
        },
        update: {}, // el seed no pisa letras que un master ya haya editado
      });
    }

    if (s.sound) {
      const has = await prisma.songAudio.findFirst({ where: { songId: s.id, url: s.sound } });
      if (!has) await prisma.songAudio.create({ data: { songId: s.id, kind: "YOUTUBE", url: s.sound } });
    }
  }
  // Los ids se insertaron a mano: se alinea la secuencia para que los próximos no choquen.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Song"', 'id'), (SELECT MAX(id) FROM "Song"))`,
  );

  // --- Playlists (solo las que tienen canciones; el resto son placeholders sin dueño real)
  for (const p of playlistsJson.playlists.filter((p) => p.songs.length > 0)) {
    await prisma.playlist.upsert({
      where: { id: p.id },
      create: { id: p.id, name: p.name, cover: p.img, ownerId: master.id },
      update: { name: p.name, cover: p.img },
    });
    await prisma.playlistSong.createMany({
      data: p.songs.map((song, position) => ({ playlistId: p.id, songId: song.id, position })),
      skipDuplicates: true,
    });
  }

  console.log("Seed completo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
