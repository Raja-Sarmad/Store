"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
import AddToCartButton from "@/components/AddToCartButton";
import { API_URL, STORE_SLUG, productHref, type CatalogMeta, type Product } from "@/lib/api";
import {
  STORE_BRANDS,
  brandApiFilter,
  brandHref,
  type StoreBrand,
} from "@/lib/brands";
import type { CatalogFilterValues } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";

const PAGE_SIZE = 8;

type BrandShopProps = {
  brand: StoreBrand;
  initialProducts: Product[];
  initialMeta: CatalogMeta | null;
  initialFilters: CatalogFilterValues;
  unavailable?: boolean;
};

async function fetchBrandPage(brand: StoreBrand, page: number, filters: CatalogFilterValues) {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    page: String(page),
    sort: filters.sort || "-createdAt",
    brand: brandApiFilter(brand),
  });
  for (const [key, value] of Object.entries(filters)) {
    if (key === "brand" || !value) continue;
    params.set(key, value);
  }
  const res = await fetch(`${API_URL}/products?${params}`, {
    headers: { "X-Store-Slug": STORE_SLUG },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Catalog unavailable");
  const json = (await res.json()) as {
    success: boolean;
    data: Product[];
    meta: CatalogMeta;
  };
  if (!json.success) throw new Error("Catalog unavailable");
  return json;
}

function filtersFromForm(form: HTMLFormElement): CatalogFilterValues {
  const data = new FormData(form);
  const get = (name: string) => String(data.get(name) || "").trim();
  return {
    search: get("search"),
    size: get("size"),
    colors: get("colors"),
    wearType: get("wearType"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    sort: get("sort") || "-createdAt",
    inStock: data.get("inStock") === "true" ? "true" : "",
    onSale: data.get("onSale") === "true" ? "true" : "",
    new: data.get("new") === "true" ? "true" : "",
  };
}

export default function BrandShop({
  brand,
  initialProducts,
  initialMeta,
  initialFilters,
  unavailable = false,
}: BrandShopProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(initialMeta?.page || 1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(unavailable ? "Products are temporarily unavailable." : "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingLock = useRef(false);

  // Reset when navigating between brand routes (server sends new props).
  useEffect(() => {
    setProducts(initialProducts);
    setMeta(initialMeta);
    setFilters(initialFilters);
    setPage(initialMeta?.page || 1);
    setError(unavailable ? "Products are temporarily unavailable." : "");
    setFiltersOpen(false);
  }, [brand.slug, initialProducts, initialMeta, initialFilters, unavailable]);

  const hasMore = Boolean(meta?.hasNextPage);
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && key !== "brand" && Boolean(value),
  ).length;

  const loadPage = useCallback(
    async (nextPage: number, nextFilters: CatalogFilterValues, mode: "append" | "replace") => {
      if (loadingLock.current) return;
      loadingLock.current = true;
      if (mode === "append") setLoadingMore(true);
      else setRefreshing(true);
      setError("");
      try {
        const result = await fetchBrandPage(brand, nextPage, nextFilters);
        setProducts((current) =>
          mode === "append"
            ? [
                ...current,
                ...result.data.filter(
                  (item) => !current.some((existing) => existing._id === item._id),
                ),
              ]
            : result.data,
        );
        setMeta(result.meta);
        setPage(result.meta.page);
        setFilters(nextFilters);
      } catch {
        setError("Could not load products. Please try again.");
      } finally {
        loadingLock.current = false;
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [brand],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadPage(page + 1, filters, "append");
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, page, filters, loadPage]);

  function onBrandChange(slug: string) {
    const next = STORE_BRANDS.find((item) => item.slug === slug);
    if (next && next.slug !== brand.slug) router.push(brandHref(next));
  }

  function onApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = filtersFromForm(event.currentTarget);
    void loadPage(1, next, "replace");
  }

  function onClearFilters() {
    const cleared: CatalogFilterValues = { sort: "-createdAt" };
    void loadPage(1, cleared, "replace");
  }

  return (
    <StoreShell>
      <header className="px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="sp-container">
          <div className="sp-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--sp-muted)]">
                Brand collection
              </p>
              <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[var(--sp-maroon-deep)] sm:text-4xl">
                {brand.name}
              </h1>
              <p className="mt-2 text-sm text-[var(--sp-muted)]">
                {meta ? `${meta.total} products` : "Shop this label"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="sp-label min-w-[11rem]">
                Brands
                <select
                  value={brand.slug}
                  onChange={(event) => onBrandChange(event.target.value)}
                  className="sp-select font-normal normal-case tracking-normal"
                >
                  {STORE_BRANDS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                className="sp-btn mt-auto h-11 px-4 py-0"
              >
                Filters
                {activeFilterCount > 0 ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] text-[var(--sp-maroon)]">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="sp-container">
          {filtersOpen && (
            <form
              key={JSON.stringify(filters)}
              onSubmit={onApplyFilters}
              className="sp-panel mb-8 p-5 sm:p-6"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <label className="sp-label col-span-2">
                  Search
                  <input
                    name="search"
                    type="search"
                    defaultValue={filters.search}
                    placeholder="Search by name…"
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  />
                </label>
                <label className="sp-label">
                  Size
                  <select
                    name="size"
                    defaultValue={filters.size || ""}
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  >
                    <option value="">All sizes</option>
                    {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sp-label">
                  Color
                  <select
                    name="colors"
                    defaultValue={filters.colors || ""}
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  >
                    <option value="">All colors</option>
                    {["black", "white", "blue", "red", "green", "beige", "pink", "brown", "grey", "olive"].map(
                      (color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <label className="sp-label">
                  Outfit type
                  <select
                    name="wearType"
                    defaultValue={filters.wearType || ""}
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  >
                    <option value="">All types</option>
                    <option value="stitched">Stitched</option>
                    <option value="unstitched">Unstitched</option>
                    <option value="modelwear">Model wear</option>
                  </select>
                </label>
                <label className="sp-label">
                  Min price
                  <input
                    name="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={filters.minPrice}
                    placeholder="0"
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  />
                </label>
                <label className="sp-label">
                  Max price
                  <input
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={filters.maxPrice}
                    placeholder="No limit"
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  />
                </label>
                <label className="sp-label">
                  Sort by
                  <select
                    name="sort"
                    defaultValue={filters.sort || "-createdAt"}
                    className="h-11 sp-input font-normal normal-case tracking-normal"
                  >
                    <option value="-createdAt">Newest</option>
                    <option value="createdAt">Oldest</option>
                    <option value="price">Price: low to high</option>
                    <option value="-price">Price: high to low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-totalSold">Best selling</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                {[
                  { name: "inStock", label: "In stock", checked: filters.inStock === "true" },
                  { name: "onSale", label: "On sale", checked: filters.onSale === "true" },
                  { name: "new", label: "New arrivals", checked: filters.new === "true" },
                ].map((filter) => (
                  <label key={filter.name} className="flex items-center gap-2 text-xs text-[var(--sp-ink)]/80">
                    <input
                      type="checkbox"
                      name={filter.name}
                      value="true"
                      defaultChecked={filter.checked}
                      className="h-4 w-4 accent-[var(--sp-maroon)]"
                    />
                    {filter.label}
                  </label>
                ))}
                <div className="ml-auto flex items-center gap-4">
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-xs font-semibold text-[var(--sp-maroon)] underline underline-offset-4"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="sp-btn h-10 px-5 py-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
          )}

          {error ? (
            <p role="alert" className="text-sm text-red-800">
              {error}
            </p>
          ) : null}

          {refreshing ? (
            <p className="mb-6 text-xs uppercase tracking-widest text-[var(--sp-muted)]">
              Updating…
            </p>
          ) : null}

          {!error && !products.length && !refreshing ? (
            <p className="text-sm text-[var(--sp-muted)]">
              No {brand.name} products match yet. Try clearing filters or pick another brand.
            </p>
          ) : null}

          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <article key={product._id} className="sp-card group flex h-full flex-col p-2 sm:p-3">
                <a href={productHref(product)} className="flex min-h-0 flex-1 flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] bg-[#f0e4d8]">
                    <div className="absolute left-2 top-2 z-10 flex gap-1 text-[9px] font-bold uppercase tracking-widest sm:left-3 sm:top-3 sm:gap-2 sm:text-[10px]">
                      {product.onSale && (
                        <span className="rounded-full bg-[#a33b5c] px-1.5 py-0.5 text-white sm:px-2 sm:py-1">Sale</span>
                      )}
                      {product.isNew && (
                        <span className="rounded-full bg-[#fff8f0] px-1.5 py-0.5 text-[var(--sp-maroon-deep)] sm:px-2 sm:py-1">New</span>
                      )}
                    </div>
                    <img
                      src={
                        product.images?.[0] ||
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 flex flex-1 flex-col">
                    <h2 className="line-clamp-2 min-h-[2.6em] font-serif text-sm font-medium leading-snug group-hover:text-[var(--sp-maroon)] sm:min-h-[2.7em] sm:text-[15px]">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--sp-muted)] sm:text-sm">
                      {formatPrice(product.price || 0)}
                      {product.onSale && Number(product.compareAtPrice) > product.price ? (
                        <del className="ml-2 text-[var(--sp-muted)]/70">
                          {formatPrice(Number(product.compareAtPrice))}
                        </del>
                      ) : null}
                    </p>
                  </div>
                </a>
                <div className="mt-auto pt-2">
                  <AddToCartButton product={product} compact />
                </div>
              </article>
            ))}
          </div>

          <div ref={sentinelRef} className="h-8 w-full" aria-hidden />

          <div className="mt-4 flex flex-col items-center gap-3 pb-6">
            {loadingMore ? (
              <p className="text-xs uppercase tracking-widest text-[var(--sp-muted)]">
                Loading more…
              </p>
            ) : null}
            {hasMore && !loadingMore ? (
              <button
                type="button"
                onClick={() => void loadPage(page + 1, filters, "append")}
                className="sp-btn-outline"
              >
                Load more
              </button>
            ) : null}
            {!hasMore && products.length > 0 ? (
              <p className="text-xs uppercase tracking-widest text-[var(--sp-muted)]">
                That&apos;s everything for {brand.name}
              </p>
            ) : null}
          </div>
        </div>
      </section>

    </StoreShell>
  );
}
