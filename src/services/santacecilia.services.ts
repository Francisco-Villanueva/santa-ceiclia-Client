import { SantaCeciliaType } from "@/types";
import { apiGet } from "./http";

export class SantaCeciliaServices {
  static getAll() {
    return apiGet<SantaCeciliaType[]>("/festivals");
  }
  static getById(id: SantaCeciliaType["id"]) {
    return apiGet<SantaCeciliaType>(`/festivals/${id}`);
  }
}
