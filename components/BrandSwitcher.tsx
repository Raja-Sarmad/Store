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
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
          Jump to another brand
        </p>
        <a
          href="/collections"
          className="text-[10px] font-semibold uppercase tracking-widest text-white/70 underline underline-offset-4 hover:text-white"
        >
          All products →
        </a>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STORE_BRANDS.map((brand) => {
          const active = brand.slug === current.slug;
          return (
            <a
              key={brand.slug}
              href={brandHref(brand)}
              aria-current={active ? "page" : undefined}
              className={`flex h-14 min-w-[7rem] shrink-0 items-center justify-center rounded-2xl border px-3 transition sm:h-16 sm:min-w-[7.5rem] ${
                active
                  ? "border-[#fff8f0] bg-[#fff8f0] text-[var(--sp-maroon-deep)]"
                  : "border-white/30 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={56}
                  className={`h-9 w-full max-w-[7.5rem] object-contain sm:h-10 ${active ? "" : "brightness-0 invert"}`}
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
