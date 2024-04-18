import { SantaCeciliaTpye } from "@/types";
import { santacecilias } from "@/mocks/santacecilias.json";
export class SantaCeciliaServices {
  static async getAll() {
    return new Promise<SantaCeciliaTpye[]>((resolve, rejct) => {
      setTimeout(() => {
        resolve(santacecilias);
      }, 0);
    });
  }
}
