import { ramas } from "@/mocks/ramas.json";
import { RamaType } from "@/types";

export class RamaServices {
  static async getAll() {
    return new Promise<RamaType[]>((resolve, rejct) => {
      setTimeout(() => {
        resolve(ramas);
      }, 0);
    });
  }
  static async getById(id: RamaType["id"]) {
    return new Promise<RamaType>((resolve, rejct) => {
      setTimeout(() => {
        resolve(ramas.filter((rama) => rama.id === id)[0]);
      }, 0);
    });
  }
}
