import { API_URL, STORE_SLUG, type Product, type CatalogMeta } from "./api";

// Server-rendered catalog pages retain pagination metadata from the API.
export async function getCatalogPage(params: URLSearchParams) {
  const response = await fetch(`${API_URL}/products?${params}`, {
    headers: { "X-Store-Slug": STORE_SLUG },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Catalog unavailable");
  const result = await response.json() as { success: boolean; data: Product[]; meta: CatalogMeta };
  if (!result.success) throw new Error("Catalog unavailable");
  return result;
}

export type CatalogFilterValues = {
  search?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  size?: string;
  colors?: string;
  wearType?: string;
  sort?: string;
  new?: string;
  onSale?: string;
  inStock?: string;
};

export type CatalogSearchParams = Promise<CatalogFilterValues & { page?: string; category?: string }>;
