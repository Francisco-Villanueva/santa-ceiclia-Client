import { playlists } from "@/mocks/playlists.json";
import { PlayListType } from "@/types";
export class PlaylistService {
  static async getAll() {
    return new Promise<PlayListType[]>((resolve, rejct) => {
      setTimeout(() => {
        resolve(playlists);
      }, 0);
    });
  }
}
