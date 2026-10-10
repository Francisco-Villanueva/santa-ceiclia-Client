export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "MASTER" | "MEMBER";
};
