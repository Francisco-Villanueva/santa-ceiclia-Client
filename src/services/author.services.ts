import { AuthorType } from "@/types";
import { apiGet, apiSend } from "./http";

export type AuthorInput = {
  name: string;
  type: AuthorType["type"];
  branchId: string | null;
};

export class AuthorService {
  static getAll() {
    return apiGet<AuthorType[]>("/authors");
  }
  static create(data: AuthorInput) {
    return apiSend<AuthorType>("POST", "/authors", data);
  }
}
