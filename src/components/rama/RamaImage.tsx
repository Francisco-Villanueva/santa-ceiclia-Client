import Image from "next/image";
import { RamaType } from "@/types";

/**
 * Logo de la rama según el tema. Se renderizan las dos variantes y el CSS muestra la que
 * corresponde: así funciona en Server Components y no hay diferencias de hidratación.
 */
export default function RamaImage({ rama, sizes = "80px" }: { rama?: RamaType; sizes?: string }) {
  if (!rama) return null;
  return (
    <>
      {rama.img.dark && (
        <Image src={rama.img.dark} alt={rama.name} fill sizes={sizes} className="object-contain dark:hidden" />
      )}
      {rama.img.light && (
        <Image
          src={rama.img.light}
          alt={rama.name}
          fill
          sizes={sizes}
          className="object-contain hidden dark:block"
        />
      )}
    </>
  );
}
