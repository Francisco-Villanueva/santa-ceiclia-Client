import { RamaType } from "@/types";
import { apiGet } from "./http";

export class RamaServices {
  static getAll() {
    return apiGet<RamaType[]>("/branches");
  }
  static getById(id: RamaType["id"]) {
    return apiGet<RamaType>(`/branches/${id}`);
  }
}
