import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  buckets: {
    // Lectura pública para que <audio> reproduzca la URL directo; escribir exige credencial.
    songs: { access: "public_read" },
  },
});
