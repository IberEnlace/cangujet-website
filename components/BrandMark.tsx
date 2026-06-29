import Image from "next/image";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`brand brand-image-link ${light ? "brand-light" : ""}`} aria-label="Cangujet home">
      <span className="brand-logo-viewport">
        <Image src="/images/cangujet-logo.png" alt="Cangujet" width={500} height={500} className="brand-logo" priority />
      </span>
    </a>
  );
}
