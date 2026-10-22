import Image from "next/image";
import { STORE_BRANDS, brandHref, type StoreBrand } from "@/lib/brands";

export default function BrandSwitcher({
  current,
  label = "Shop by brand",
}: {
  current: StoreBrand;
  label?: string;
}) {
  return (
    <nav aria-label={label} className="w-full">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-300">
          Jump to another brand
        </p>
        <a
          href="/collections"
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 underline underline-offset-4 hover:text-white"
        >
          All products →
        </a>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STORE_BRANDS.map((brand) => {
          const active = brand.slug === current.slug;
          return (
            <a
              key={brand.slug}
              href={brandHref(brand)}
              aria-current={active ? "page" : undefined}
              className={`flex h-16 min-w-[7.5rem] shrink-0 items-center justify-center border px-3 transition ${
                active
                  ? "border-white bg-white text-black"
                  : "border-white/40 bg-black/20 text-white hover:border-white"
              }`}
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={56}
                  className={`h-10 w-full max-w-[8rem] object-contain ${active ? "" : "brightness-0 invert"}`}
                />
              ) : (
                <span className="font-serif text-sm font-semibold tracking-wide">
                  {brand.name === "Khaadi" ? "KHAADI" : brand.name}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
