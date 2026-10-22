"use client";

import { STORE_BRANDS, brandHref } from "@/lib/brands";

export default function BrandFilterSelect({ currentSlug }: { currentSlug: string }) {
  return (
    <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
      Brand page
      <select
        value={currentSlug}
        onChange={(event) => {
          const next = STORE_BRANDS.find((brand) => brand.slug === event.target.value);
          if (next) window.location.assign(brandHref(next));
        }}
        className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
      >
        {STORE_BRANDS.map((brand) => (
          <option key={brand.slug} value={brand.slug}>
            {brand.name}
          </option>
        ))}
      </select>
    </label>
  );
}
