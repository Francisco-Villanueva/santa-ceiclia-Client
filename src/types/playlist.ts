import { SongType } from "./song";

export type PlayListType = {
  id: string;
  name: string;
  img: string;
  owner: string;
  songs: SongType[];
};
