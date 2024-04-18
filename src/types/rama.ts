import { SongType } from "./song";

export type RamaType = {
  id: string;
  name: string;
  img: {
    light: string;
    dark: string;
  };
  songs: SongType[];
};
