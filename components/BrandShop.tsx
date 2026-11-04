"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="h-20" aria-hidden />

      {/* Compact hero */}
      <header className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-12 sm:py-10">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
              Brand collection
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {meta ? `${meta.total} products` : "Shop this label"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex min-w-[11rem] flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Brands
              <select
                value={brand.slug}
                onChange={(event) => onBrandChange(event.target.value)}
                className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-black outline-none focus:border-black"
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
              className="mt-auto inline-flex h-11 items-center gap-2 border border-zinc-900 bg-zinc-900 px-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-black"
            >
              Filters
              {activeFilterCount > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center bg-white px-1 text-[10px] text-black">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 py-10 sm:px-12 sm:py-12">
        <div className="mx-auto max-w-7xl">
          {filtersOpen && (
            <form
              key={JSON.stringify(filters)}
              onSubmit={onApplyFilters}
              className="mb-10 border border-zinc-200 bg-zinc-50 p-5 sm:p-6"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <label className="col-span-2 flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Search
                  <input
                    name="search"
                    type="search"
                    defaultValue={filters.search}
                    placeholder="Search by name…"
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Size
                  <select
                    name="size"
                    defaultValue={filters.size || ""}
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
                  >
                    <option value="">All sizes</option>
                    {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Color
                  <select
                    name="colors"
                    defaultValue={filters.colors || ""}
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
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
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Outfit type
                  <select
                    name="wearType"
                    defaultValue={filters.wearType || ""}
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
                  >
                    <option value="">All types</option>
                    <option value="stitched">Stitched</option>
                    <option value="unstitched">Unstitched</option>
                    <option value="modelwear">Model wear</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Min price
                  <input
                    name="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={filters.minPrice}
                    placeholder="0"
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Max price
                  <input
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={filters.maxPrice}
                    placeholder="No limit"
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
                  Sort by
                  <select
                    name="sort"
                    defaultValue={filters.sort || "-createdAt"}
                    className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black"
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
                  <label key={filter.name} className="flex items-center gap-2 text-xs text-zinc-700">
                    <input
                      type="checkbox"
                      name={filter.name}
                      value="true"
                      defaultChecked={filter.checked}
                      className="h-4 w-4 accent-black"
                    />
                    {filter.label}
                  </label>
                ))}
                <div className="ml-auto flex items-center gap-4">
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-xs font-bold uppercase tracking-wider underline underline-offset-4"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-zinc-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
          )}

          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {refreshing ? (
            <p className="mb-6 text-xs font-mono uppercase tracking-widest text-zinc-500">
              Updating…
            </p>
          ) : null}

          {!error && !products.length && !refreshing ? (
            <p className="text-sm text-zinc-600">
              No {brand.name} products match yet. Try clearing filters or pick another brand.
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <article key={product._id} className="group">
                <a href={productHref(product)} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                    <div className="absolute left-2 top-2 z-10 flex gap-1 text-[9px] font-bold uppercase tracking-widest sm:left-3 sm:top-3 sm:gap-2 sm:text-[10px]">
                      {product.onSale && (
                        <span className="bg-red-700 px-1.5 py-0.5 text-white sm:px-2 sm:py-1">Sale</span>
                      )}
                      {product.isNew && (
                        <span className="bg-white px-1.5 py-0.5 text-black sm:px-2 sm:py-1">New</span>
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
                  <div className="mt-3">
                    <h2 className="text-[11px] font-black uppercase tracking-wider group-hover:underline sm:text-xs">
                      {product.name}
                    </h2>
                    <p className="mt-1 font-mono text-[11px] text-zinc-600 sm:text-xs">
                      {formatPrice(product.price || 0)}
                      {product.onSale && Number(product.compareAtPrice) > product.price ? (
                        <del className="ml-2 text-zinc-400">
                          {formatPrice(Number(product.compareAtPrice))}
                        </del>
                      ) : null}
                    </p>
                  </div>
                </a>
                <AddToCartButton product={product} compact />
              </article>
            ))}
          </div>

          <div ref={sentinelRef} className="h-8 w-full" aria-hidden />

          <div className="mt-4 flex flex-col items-center gap-3 pb-6">
            {loadingMore ? (
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                Loading more…
              </p>
            ) : null}
            {hasMore && !loadingMore ? (
              <button
                type="button"
                onClick={() => void loadPage(page + 1, filters, "append")}
                className="border border-zinc-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white"
              >
                Load more
              </button>
            ) : null}
            {!hasMore && products.length > 0 ? (
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                That&apos;s everything for {brand.name}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
