import { PlayListType } from "@/types";
import { apiGet } from "./http";

export class PlaylistService {
  static getAll() {
    return apiGet<PlayListType[]>("/playlists");
  }
  static getById(id: PlayListType["id"]) {
    return apiGet<PlayListType>(`/playlists/${id}`);
  }
}
