import Image from "next/image";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`brand brand-image-link ${light ? "brand-light" : "brand-green"}`} aria-label="Cangujet home">
      <span className="brand-logo-viewport">
        <Image src="/images/cangujet-logo-variants.png" alt="Cangujet" width={1536} height={1024} className="brand-logo" priority />
      </span>
    </a>
  );
}
