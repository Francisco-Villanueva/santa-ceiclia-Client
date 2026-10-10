import { SongType } from "./song";

export type SantaCeciliaType = {
  id: string;
  year: number;
  place: string | null;
  /** Id de la rama ganadora. */
  winner: string | null;
  songs: SongType[];
};
