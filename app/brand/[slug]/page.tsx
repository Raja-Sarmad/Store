import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandShop from "@/components/BrandShop";
import { brandApiFilter, getBrandBySlug, STORE_BRANDS } from "@/lib/brands";
import { getCatalogPage, type CatalogFilterValues, type CatalogSearchParams } from "@/lib/catalog";

const PAGE_SIZE = 8;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: CatalogSearchParams;
};

export function generateStaticParams() {
  return STORE_BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand not found · Sab Pehno" };
  return {
    title: `${brand.name} · Sab Pehno`,
    description: `Shop ${brand.name} products at Sab Pehno.`,
  };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const search = await searchParams;
  const minPrice = Number(search.minPrice);
  const maxPrice = Number(search.maxPrice);
  const filters: CatalogFilterValues = {
    search: search.search?.trim(),
    size: search.size,
    colors: search.colors,
    wearType: ["stitched", "unstitched", "modelwear"].includes(search.wearType || "")
      ? search.wearType
      : "",
    minPrice: search.minPrice && Number.isFinite(minPrice) && minPrice >= 0 ? search.minPrice : "",
    maxPrice: search.maxPrice && Number.isFinite(maxPrice) && maxPrice >= 0 ? search.maxPrice : "",
    sort: search.sort,
    new: search.new === "true" ? "true" : "",
    onSale: search.onSale === "true" ? "true" : "",
    inStock: search.inStock === "true" ? "true" : "",
  };
  const allowedSorts = ["-createdAt", "createdAt", "price", "-price", "name", "-totalSold", "-rating"];
  if (!allowedSorts.includes(filters.sort || "")) filters.sort = "-createdAt";

  const query = new URLSearchParams({
    limit: String(PAGE_SIZE),
    page: "1",
    sort: filters.sort || "-createdAt",
    brand: brandApiFilter(brand),
  });
  for (const [key, value] of Object.entries(filters)) {
    if (key === "brand" || !value) continue;
    query.set(key, value);
  }

  const catalog = await getCatalogPage(query).catch(() => null);

  return (
    <BrandShop
      brand={brand}
      initialProducts={catalog?.data ?? []}
      initialMeta={catalog?.meta ?? null}
      initialFilters={filters}
      unavailable={!catalog}
    />
  );
}
