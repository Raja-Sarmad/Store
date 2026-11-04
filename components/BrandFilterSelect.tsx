"use client";

import { STORE_BRANDS, brandHref } from "@/lib/brands";

export default function BrandFilterSelect({ currentSlug }: { currentSlug: string }) {
  return (
    <label className="sp-label">
      Brand page
      <select
        value={currentSlug}
        onChange={(event) => {
          const next = STORE_BRANDS.find((brand) => brand.slug === event.target.value);
          if (next) window.location.assign(brandHref(next));
        }}
        className="sp-select font-normal normal-case tracking-normal"
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
