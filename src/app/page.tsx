import { redirect } from "next/navigation";

// La app vive en /home; la raíz antes devolvía una página en blanco.
export default function RootPage() {
  redirect("/home");
}
