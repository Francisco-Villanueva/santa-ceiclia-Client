# Santa Cecilia — cancionero scout

Aplicación web tipo Spotify para el cancionero de un grupo scout. Permite cargar canciones, escucharlas si tienen audio, leer la letra y ver los acordes alineados sobre la letra. Es un MVP: backend y frontend viven en este mismo proyecto Next.js.

Idioma del proyecto: español (UI, mensajes de error de la API, comentarios). Mantenelo.

## Dominio

- **Canción:** título, año de creación (obligatorio), autor, y opcionalmente lugar, festival, letra (con o sin acordes) y audios.
- **Autor:** puede ser una **rama** o no. Tipos: `BRANCH` (requiere `branchId`), `PERSON`, `GROUP` (ej. "Sin Totem"), `OTHER` (ej. "Cjo Comunidad", "Los cocineros"). Un autor es `BRANCH` si y solo si tiene `branchId`.
- **Ramas (8, fijas):** Alitas, Manada, Caravana, Unidad, Solar, Caminantes, Clan, Rovers. No hay API de escritura para ramas.
- **Santa Cecilia (`Festival` en la base):** festival anual con año único, lugar y rama ganadora. En el código de UI se sigue llamando "santacecilia(s)".
- **Usuarios:** rol `MASTER` (carga y edita canciones, letras, audios, autores, festivales) o `MEMBER` (solo lectura por ahora; luego, sus propias playlists). Cualquiera puede escuchar y leer sin cuenta.
- **Audio:** `FILE` (archivo subido al storage) o `YOUTUBE` (link externo, `https://`).

## Stack

Next.js 14.1 (App Router) · React 18 · TypeScript · Tailwind + shadcn/Radix (`src/components/ui`) · Zustand · Prisma 7 + PostgreSQL en **Neon** · zod 4 · `jose` + `bcryptjs` (sesión propia, sin Auth.js) · Neon Object Storage (S3 compatible, `@aws-sdk/client-s3`) · `react-player` para reproducir.

Deploy en Vercel (Node **24.x**; Node 20 ya no se soporta). Local: Node 22.

## Comandos

```bash
npm run dev                  # http://localhost:4000
npm run build / start / lint
npx tsc --noEmit             # chequeo de tipos (no hay tests automáticos)
npm run db:migrate           # prisma migrate dev (usa DIRECT_URL)
npm run db:seed              # importa src/mocks/*.json (carga inicial)
npm run db:studio
npm run db:convert-lyrics    # simulación: letras en cifrado clásico → ChordPro
npm run db:convert-lyrics -- --apply
```

`postinstall` ejecuta `prisma generate`. El cliente se genera en `src/generated/prisma` (ignorado por git, no editar).

## Variables de entorno

Se leen de `.env.local` (ignorado por git); `.env.example` lista todas. Nunca commitear credenciales ni pegarlas en chats.

- `DATABASE_URL` — Neon **con pooler** (la usa la app en runtime vía `@prisma/adapter-pg`).
- `DIRECT_URL` — Neon **sin pooler** (la usan `prisma.config.ts`, migraciones y scripts).
- `SESSION_SECRET` — firma de la cookie, mínimo 32 caracteres.
- `SEED_MASTER_EMAIL` / `SEED_MASTER_PASSWORD` — master inicial que crea el seed.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION` — Neon Object Storage (los escribe `neon env pull`; bucket `songs`, definido en `neon.ts`).
- `STORAGE_PUBLIC_URL` — `<AWS_ENDPOINT_URL_S3>/songs`; con eso `toSong` arma la URL reproducible de los audios `FILE`.

## Estructura

```
prisma/schema.prisma      esquema; seed.ts; convert-lyrics.ts
prisma.config.ts          config de Prisma 7 (URL del CLI, ruta del seed)
neon.ts                   definición del bucket de Neon Storage
src/app/api/              Route Handlers (ver abajo)
src/app/home/             UI: songs, lyrics, santacecilias, playlist; Provider carga stores
src/app/login/            página de login
src/lib/prisma.ts         singleton PrismaClient (adapter-pg)
src/lib/api/              dto.ts (mappers fila→DTO), http.ts, schemas.ts (zod), refs.ts
src/lib/auth/             session.ts (JWT/cookie), guard.ts (requireMaster), rateLimit.ts
src/lib/chords/           chord.ts, chordpro.ts, convert.ts
src/lib/lyrics.ts         detectChords(content, format)
src/lib/storage.ts        S3: presign, head, delete
src/services/             clientes fetch de la API (http.ts: apiGet/apiSend/ApiError)
src/store/                Zustand: songs, playlists, ramas, santacecilias, auth
src/components/           UI; lyrics/ (ChordSheet, LyricsViewer), songs/editor/, auth/
src/mocks/                JSON originales; solo los usa el seed
```

Alias `@/` → `src/`. Los archivos del repo usan **CRLF** (git `autocrlf`); al editar archivos existentes conservá los saltos de línea. Los archivos nuevos en LF no son problema.

## API

Lectura (pública): `GET /api/songs` (filtros `q`, `branch` slug, `author`, `year`, `festival`, `hasLyrics`, `hasChords`, `hasAudio`), `/songs/[id]`, `/branches` y `/branches/[id]` (id o slug), `/authors`, `/festivals` y `/festivals/[id]` (incluyen canciones), `/playlists` y `/playlists/[id]` (solo públicas).

Auth: `POST /api/auth/login|logout`, `GET /api/auth/me`.

Escritura (solo MASTER): `POST /songs`, `PATCH|DELETE /songs/[id]`, `PUT|DELETE /songs/[id]/lyrics`, `POST /songs/[id]/audio` (`YOUTUBE` con `url`, `FILE` con `storageKey`), `POST /songs/[id]/audio/upload` (URL prefirmada), `DELETE /songs/[id]/audio/[audioId]`, `POST /authors`, `PATCH|DELETE /authors/[id]`, `POST /festivals`, `PATCH|DELETE /festivals/[id]`.

Convenciones de los handlers: `export const dynamic = "force-dynamic"`; envolver en `respond()` (traduce `HttpError`, `ZodError` y errores Prisma P2002→409, P2003→409, P2025→404); validar body con `parseBody(req, schema)`; devolver DTOs vía `src/lib/api/dto.ts`, nunca filas de Prisma. Para recursos referenciados usar `assertRefs` (400 claro en vez de error de FK). Todo endpoint de escritura llama `requireMaster(req)` primero.

## Autenticación

Cookie `sc_session` (httpOnly, SameSite=Lax, 7 días) con un JWT que solo guarda el id del usuario. **El rol se consulta en la base en cada escritura** (revocar un master tiene efecto inmediato). `requireMaster` rechaza además `Origin` de otro host. El login tiene un rate limit en memoria (5 intentos / 15 min; en serverless es una barrera parcial). No hay registro público ni alta de masters desde la app: se crean con el seed o a mano en la base.

## Letras y acordes

- Formato canónico: **ChordPro**, acordes entre corchetes antes de la sílaba: `Cuando [Am]sale la [G]luna`. Se guarda en `SongLyrics.content` (texto); `hasChords` lo calcula el servidor.
- `LyricsFormat` también admite `CHORDS_OVER_LYRICS` (acordes en una línea sobre la letra, formato legado de los mocks). `PUT /lyrics` lo convierte con `convertChordsOverLyrics` y guarda siempre ChordPro. Los tabs se expanden a 4 columnas, así que en esas letras la posición es aproximada.
- `ChordSheet` renderiza cada tramo como una columna (acorde arriba, texto abajo), sin depender de espacios ni fuente monoespaciada. `transposeChordPro` / `transposeChord` transponen; conservan bemoles/sostenidos y usan nombres comunes de guitarra para acordes naturales.
- El reconocimiento de acordes es solo notación anglosajona (`C`, `Am7`, `F#m`, `G/B`, `Bb`, `Dsus4`, `Cadd9`). No cubre `C7M`, `m7(b5)` ni Do-Re-Mi.

## Datos y ids

- Las canciones conservan sus ids numéricos originales de los mocks (incluido el `0`); el seed alinea la secuencia. Autores, festivales, ramas y playlists usan cuid.
- El seed normaliza autores por `authorId` en minúsculas (`clan` = `Clan`), mapea `sc_<año>` a festivales y `sc_ruca` → 2003. Canciones sin festival (`sc_nn`, 1994) quedan con `festivalId` null.
- **El seed no pisa letras ya editadas, pero sí sobrescribe los datos de las canciones** (título, año, autor) si se vuelve a correr. No lo ejecutes sobre la base de producción ya cargada.
- Playlists: solo "Sin Tótem" está sembrada (a nombre del master). Las demás de los mocks eran placeholders.

## Estado y pendientes

Hecho: esquema + seed, API de lectura y escritura, login, acordes (parser, conversor, transposición, visor), editor de canciones para masters con vista previa, subida de audio a Neon Storage.

Pendiente / problemas conocidos:
- Playlists de la comunidad persistidas (crear/editar con usuarios `MEMBER`); hoy la UI de playlists es de solo lectura y el store las modifica solo en memoria.
- Alta de usuarios (registro de members, creación de masters).
- Error de hidratación en consola en todas las páginas de `/home` (anterior a este trabajo, sin resolver).
- El menú lateral tapa el contenido en pantallas chicas.
- Sin tests automáticos ni CI; las verificaciones se hicieron con scripts temporales y a mano.
- `GET /api/songs` no pagina y trae las letras completas; está bien con ~40 canciones, habrá que paginar si crece.
- La canción 20 (de Unidad) viene sin título desde los mocks.

## Cómo trabajar acá

- Probar cambios de API con `npm run dev` y la base de Neon real; si creás datos de prueba, borralos al terminar.
- Antes de dar algo por hecho: `npx tsc --noEmit` (y `next build` si tocás rutas o configuración).
- Cambios de esquema: editar `prisma/schema.prisma` y correr `npm run db:migrate`; no resetear la base de Neon sin avisar (tiene datos reales).
- Al agregar un endpoint de escritura: `requireMaster`, `parseBody` con schema en `schemas.ts`, `respond`, DTO en `dto.ts`, y método en el servicio del cliente.
