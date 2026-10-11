import { AuthorType } from "@/types";
import { apiSend } from "./http";

export type AuthorInput = {
  name: string;
  type: AuthorType["type"];
  branchId: string | null;
};

export class AuthorService {
  static create(data: AuthorInput) {
    return apiSend<AuthorType>("POST", "/authors", data);
  }
}
