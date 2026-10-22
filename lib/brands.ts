export type StoreBrand = {
  name: string;
  slug: string;
  logo?: string;
  /** Extra names used on products in the API (e.g. Farasha ↔ Frasaha). */
  aliases?: string[];
};

export const STORE_BRANDS: StoreBrand[] = [
  { name: "Xenia", slug: "xenia", logo: "/xenialogo.avif" },
  { name: "Afrozeh", slug: "afrozeh", logo: "/brand-logos/afrozeh.png" },
  { name: "Jazmine", slug: "jazmine", logo: "/Jazminlogo.webp", aliases: ["Jazmin"] },
  { name: "Alizeh", slug: "alizeh", logo: "/Alizehlogo.webp" },
  { name: "Frasaha", slug: "frasaha", logo: "/brand-logos/frasaha.png", aliases: ["Farasha"] },
  { name: "Nishat", slug: "nishat", logo: "/nishatlogo.avif" },
  { name: "Sapphire", slug: "sapphire" },
  { name: "Khaadi", slug: "khaadi" },
  { name: "Zellbury", slug: "zellbury", logo: "/brand-logos/zellbury.png" },
];

export function normalizeBrandName(name: string) {
  const normalized = name.trim().toLowerCase();
  if (normalized === "frasaha" || normalized === "farasha") return "frasaha";
  if (normalized === "jazmine" || normalized === "jazmin") return "jazmine";
  return normalized;
}

export function brandHref(brand: Pick<StoreBrand, "slug">) {
  return `/brand/${brand.slug}`;
}

export function getBrandBySlug(slug: string) {
  const key = slug.trim().toLowerCase();
  return STORE_BRANDS.find((brand) => brand.slug === key) ?? null;
}

export function getBrandByName(name: string) {
  const key = normalizeBrandName(name);
  return (
    STORE_BRANDS.find((brand) => normalizeBrandName(brand.name) === key) ??
    STORE_BRANDS.find((brand) =>
      (brand.aliases || []).some((alias) => normalizeBrandName(alias) === key),
    ) ??
    null
  );
}

/** Comma-separated brand names for API `?brand=` (exact match, case-insensitive). */
export function brandApiFilter(brand: StoreBrand) {
  return [brand.name, ...(brand.aliases || [])].join(",");
}
