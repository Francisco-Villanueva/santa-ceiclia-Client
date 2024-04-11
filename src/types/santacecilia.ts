import { SongType } from "./song";

export type SantaCeciliaTpye = {
  id: string;
  year: number;
  songs: SongType[];
  winner: string;
  place: string;
};
