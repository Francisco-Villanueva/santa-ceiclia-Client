export type AuthorType = {
  id: string;
  name: string;
  type: "BRANCH" | "PERSON" | "GROUP" | "OTHER";
  branchId: string | null;
};
