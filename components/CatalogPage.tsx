import ProductListingPage from "./ProductListingPage";
import { apiFetch, type Category } from "@/lib/api";
import { getCatalogPage, type CatalogFilterValues, type CatalogSearchParams } from "@/lib/catalog";
import { brandApiFilter, type StoreBrand } from "@/lib/brands";

export default async function CatalogPage({ title, eyebrow, copy, path, filters = {}, searchParams, lockedBrand }: {
  title: string; eyebrow: string; copy: string; path: string;
  filters?: Record<string, string>; searchParams: CatalogSearchParams;
  lockedBrand?: StoreBrand;
}) {
  const search = await searchParams;
  const page = Math.max(1, Number.parseInt(search.page || "1", 10) || 1);
  const category = typeof search.category === "string" ? search.category : "";
  const minPrice = Number(search.minPrice);
  const maxPrice = Number(search.maxPrice);
  const lockedBrandFilter = lockedBrand ? brandApiFilter(lockedBrand) : "";
  const activeFilters: CatalogFilterValues = {
    search: search.search?.trim(),
    brand: lockedBrandFilter || search.brand?.trim(),
    minPrice: search.minPrice && Number.isFinite(minPrice) && minPrice >= 0 ? search.minPrice : "",
    maxPrice: search.maxPrice && Number.isFinite(maxPrice) && maxPrice >= 0 ? search.maxPrice : "",
    size: search.size,
    colors: search.colors,
    wearType: ["stitched", "unstitched", "modelwear"].includes(search.wearType || "") ? search.wearType : "",
    sort: search.sort,
    new: search.new === "true" || filters.new === "true" ? "true" : "",
    onSale: search.onSale === "true" || filters.onSale === "true" ? "true" : "",
    inStock: search.inStock === "true" ? "true" : "",
  };
  const allowedSorts = ["-createdAt", "createdAt", "price", "-price", "name", "-totalSold", "-rating"];
  if (!allowedSorts.includes(activeFilters.sort || "")) activeFilters.sort = "-createdAt";
  // Locked brand pages own the brand via path — don't inherit a stale filters.brand override.
  const pathFilters = { ...filters };
  delete pathFilters.brand;
  const params = new URLSearchParams({
    limit: "12",
    sort: activeFilters.sort || "-createdAt",
    ...pathFilters,
    page: String(page),
  });
  for (const [key, value] of Object.entries(activeFilters)) {
    if (value) params.set(key, value);
  }
  if (category) params.set("categorySlug", category);
  const [catalog, categories] = await Promise.all([
    getCatalogPage(params).catch(() => null),
    apiFetch<Category[]>("/categories/all").catch(() => null),
  ]);
  return <ProductListingPage title={title} eyebrow={eyebrow} copy={copy}
    products={catalog?.data ?? []} meta={catalog?.meta} path={path}
    filters={activeFilters} categories={categories ?? []} activeCategory={category}
    unavailable={!catalog} lockedBrand={lockedBrand} />;
}
