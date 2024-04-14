import { songs } from "@/mocks/songs.json";
import { SongType } from "@/types";
export class SongService {
  static async getAllSongs() {
    return new Promise<SongType[]>((resolve, rejct) => {
      setTimeout(() => {
        resolve(songs);
      }, 0);
    });
  }
}
