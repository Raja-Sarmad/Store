"use client";

import Image from "next/image";
import { STORE_BRANDS, brandHref } from "@/lib/brands";

/** Skip logos that render as solid black blocks (photo/opaque assets). */
const FEATURED_BRANDS = STORE_BRANDS.filter((brand) => !["sapphire", "khaadi"].includes(brand.slug));

function BrandItem({
  brand,
  showBorder,
}: {
  brand: (typeof FEATURED_BRANDS)[number];
  showBorder?: boolean;
}) {
  return (
    <a
      href={brandHref(brand)}
      className={`flex w-[9.5rem] shrink-0 flex-col items-center justify-end bg-transparent px-4 sm:w-[10.5rem] ${
        showBorder ? "border-l border-[#e8ddd3]/80" : ""
      }`}
      aria-label={`Shop ${brand.name}`}
    >
      <span className="relative mb-2 flex h-9 w-full max-w-[7rem] items-end justify-center bg-transparent sm:h-10">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt=""
            width={140}
            height={40}
            className="mx-auto h-full w-auto max-h-9 max-w-full bg-transparent object-contain object-bottom mix-blend-multiply sm:max-h-10"
          />
        ) : null}
      </span>
      <span className="h-4 text-center text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[#3a241f] sm:text-xs">
        {brand.name}
      </span>
    </a>
  );
}

export default function HomeBrands() {
  const loop = [...FEATURED_BRANDS, ...FEATURED_BRANDS];

  return (
    <section id="brands" className="bg-transparent px-4 py-10 sm:px-6 sm:py-12">
      <div className="sp-container">
        <div className="flex items-center justify-center gap-5">
          <span
            aria-hidden
            className="hidden h-px w-20 sm:block lg:w-28"
            style={{ background: "linear-gradient(90deg, transparent, #c9b09a)" }}
          />
          <h2 className="text-center font-serif text-[2rem] font-medium tracking-tight text-[#3a241f] sm:text-[2.55rem]">
            Our Featured Brands
          </h2>
          <span
            aria-hidden
            className="hidden h-px w-20 sm:block lg:w-28"
            style={{ background: "linear-gradient(90deg, #c9b09a, transparent)" }}
          />
        </div>

        <div className="mt-10 overflow-hidden bg-transparent">
          <div className="sp-brands-track flex w-max items-end bg-transparent">
            {loop.map((brand, index) => (
              <BrandItem
                key={`${brand.slug}-${index}`}
                brand={brand}
                showBorder={index > 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
