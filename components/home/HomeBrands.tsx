"use client";

import { useState } from "react";
import Image from "next/image";
import { STORE_BRANDS, brandHref } from "@/lib/brands";

/** Skip logos that render as solid black blocks (photo/opaque assets). */
const FEATURED_BRANDS = STORE_BRANDS.filter((brand) => !["sapphire", "khaadi"].includes(brand.slug));
const PAGE = 5;

export default function HomeBrands() {
  const [start, setStart] = useState(0);
  const total = FEATURED_BRANDS.length;
  const visible = Array.from({ length: Math.min(PAGE, total) }, (_, i) => FEATURED_BRANDS[(start + i) % total]);

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

        <div className="mt-10 flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Previous brands"
            onClick={() => setStart((current) => (current - 1 + total) % total)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-2xl text-[#3a241f] shadow-[0_8px_22px_rgba(80,40,40,0.12)] sm:h-12 sm:w-12"
          >
            ‹
          </button>

          <div className="flex min-w-0 flex-1 items-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visible.map((brand, index) => (
              <a
                key={`${brand.slug}-${start}`}
                href={brandHref(brand)}
                className={`flex min-w-[7.75rem] flex-1 flex-col items-center justify-end px-3 sm:min-w-[8.75rem] sm:px-4 ${
                  index > 0 ? "border-l border-[#e8ddd3]" : ""
                }`}
                aria-label={`Shop ${brand.name}`}
              >
                {/* Mark/logo can sit higher; name always on shared baseline below */}
                <span className="relative mb-2 flex h-9 w-full max-w-[7rem] items-end justify-center sm:h-10">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt=""
                      width={140}
                      height={40}
                      className="mx-auto h-full w-auto max-h-9 max-w-full object-contain object-bottom sm:max-h-10"
                    />
                  ) : null}
                </span>
                <span className="h-4 text-center text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[#3a241f] sm:text-xs">
                  {brand.name}
                </span>
              </a>
            ))}

            <a
              href="/collections"
              className="flex min-w-[6.75rem] shrink-0 flex-col items-center justify-end border-l border-[#e8ddd3] px-3 pb-0"
            >
              <span className="mb-2 block h-9 sm:h-10" aria-hidden />
              <span className="h-4 text-[12px] leading-none text-[#8d7a6e]">and more...</span>
            </a>
          </div>

          <button
            type="button"
            aria-label="Next brands"
            onClick={() => setStart((current) => (current + 1) % total)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-2xl text-[#3a241f] shadow-[0_8px_22px_rgba(80,40,40,0.12)] sm:h-12 sm:w-12"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
