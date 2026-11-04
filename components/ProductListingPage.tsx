import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import type { Product, Category, CatalogMeta } from "@/lib/api";
import { productHref } from "@/lib/api";
import { formatPrice } from "@/lib/money";
import type { CatalogFilterValues } from "@/lib/catalog";
import AddToCartButton from "@/components/AddToCartButton";
import BrandSwitcher from "@/components/BrandSwitcher";
import BrandFilterSelect from "@/components/BrandFilterSelect";
import type { StoreBrand } from "@/lib/brands";

export default function ProductListingPage({
  eyebrow,
  title,
  copy,
  products,
  categories,
  filters = {},
  activeCategory = "",
  meta,
  path = "/collections",
  unavailable = false,
  lockedBrand,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  products: Product[];
  categories?: Category[];
  filters?: CatalogFilterValues;
  activeCategory?: string;
  meta?: CatalogMeta;
  path?: string;
  unavailable?: boolean;
  lockedBrand?: StoreBrand;
}) {
  const buildUrl = (page: number, category = activeCategory) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (!value || (lockedBrand && key === "brand")) continue;
      params.set(key, value);
    }
    params.set("page", String(page));
    if (category) params.set("category", category);
    return `${path}?${params}`;
  };

  return (
    <StoreShell>
      <PageHero eyebrow={eyebrow} title={title} description={copy}>
        {lockedBrand ? <BrandSwitcher current={lockedBrand} /> : null}
        {categories && categories.length > 0 ? (
          <nav
            aria-label="Product categories"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <a
              href={buildUrl(1, "")}
              aria-current={!activeCategory ? "page" : undefined}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-wide transition ${
                !activeCategory
                  ? "bg-[#fff8f0] text-[var(--sp-maroon-deep)]"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              All
            </a>
            {categories.map((category) => (
              <a
                key={category._id}
                href={buildUrl(1, category.slug)}
                aria-current={activeCategory === category.slug ? "page" : undefined}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-wide transition ${
                  activeCategory === category.slug
                    ? "bg-[#fff8f0] text-[var(--sp-maroon-deep)]"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                {category.name}
              </a>
            ))}
          </nav>
        ) : null}
      </PageHero>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <form action={path} method="get" className="sp-panel mb-8 p-4 sm:p-6">
            {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <label className="sp-label col-span-2 sm:col-span-3 lg:col-span-2">
                Search products
                <input
                  name="search"
                  type="search"
                  defaultValue={filters.search}
                  placeholder="Search by name..."
                  className="sp-input font-normal normal-case tracking-normal"
                />
              </label>
              {lockedBrand ? (
                <BrandFilterSelect currentSlug={lockedBrand.slug} />
              ) : (
                <label className="sp-label">
                  Brand
                  <input
                    name="brand"
                    list="catalog-brands"
                    defaultValue={filters.brand}
                    placeholder="Any brand"
                    className="sp-input font-normal normal-case tracking-normal"
                  />
                  <datalist id="catalog-brands">
                    {["Xenia", "Afrozeh", "Jazmine", "Alizeh", "Frasaha", "Farasha", "Nishat", "Sapphire", "Khaadi", "Zellbury", "Overdose"].map(
                      (brand) => (
                        <option key={brand} value={brand} />
                      ),
                    )}
                  </datalist>
                </label>
              )}
              <label className="sp-label">
                Size
                <select name="size" defaultValue={filters.size || ""} className="sp-select font-normal normal-case tracking-normal">
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
                <select name="colors" defaultValue={filters.colors || ""} className="sp-select font-normal normal-case tracking-normal">
                  <option value="">All colors</option>
                  {["black", "white", "blue", "red", "green", "beige", "pink", "brown", "grey", "olive"].map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sp-label">
                Outfit type
                <select name="wearType" defaultValue={filters.wearType || ""} className="sp-select font-normal normal-case tracking-normal">
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
                  className="sp-input font-normal normal-case tracking-normal"
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
                  className="sp-input font-normal normal-case tracking-normal"
                />
              </label>
              <label className="sp-label">
                Sort by
                <select name="sort" defaultValue={filters.sort || "-createdAt"} className="sp-select font-normal normal-case tracking-normal">
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="price">Price: low to high</option>
                  <option value="-price">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-totalSold">Best selling</option>
                  <option value="-rating">Top rated</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[
                  { name: "inStock", label: "In stock", checked: filters.inStock === "true", disabled: false },
                  { name: "onSale", label: "On sale", checked: filters.onSale === "true", disabled: path === "/sales" },
                  { name: "new", label: "New arrivals", checked: filters.new === "true", disabled: path === "/new-arrival" },
                ].map((filter) => (
                  <label key={filter.name} className="flex items-center gap-2 text-xs text-[var(--sp-ink)]/80">
                    <input
                      type="checkbox"
                      name={filter.name}
                      value="true"
                      defaultChecked={filter.checked}
                      disabled={filter.disabled}
                      className="h-4 w-4 accent-[var(--sp-maroon)] disabled:opacity-50"
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 sm:ml-auto">
                <a href={path} className="text-xs font-semibold text-[var(--sp-maroon)] underline underline-offset-4">
                  Clear
                </a>
                <button type="submit" className="sp-btn h-10 px-5 py-0">
                  Apply filters
                </button>
              </div>
            </div>
          </form>

          {meta ? (
            <p className="mb-5 text-xs uppercase tracking-[0.16em] text-[var(--sp-muted)]">
              Showing {products.length} of {meta.total} products
            </p>
          ) : null}

          {unavailable ? (
            <p role="alert" className="sp-panel p-6 text-sm">
              Products are temporarily unavailable. Please refresh to try again.
            </p>
          ) : !products.length ? (
            <p className="sp-panel p-6 text-sm text-[var(--sp-muted)]">
              No products match this selection yet. Try changing your filters or explore{" "}
              <a className="font-semibold text-[var(--sp-maroon)] underline" href="/collections">
                all collections
              </a>
              .
            </p>
          ) : null}

          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <article key={product._id} className="sp-card group flex h-full flex-col p-2 sm:p-3">
                <a href={productHref(product)} className="flex min-h-0 flex-1 flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] bg-[#f0e4d8]">
                    <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-1 text-[9px] font-bold uppercase tracking-wider sm:left-3 sm:top-3 sm:text-[10px]">
                      {product.tags?.includes("Premium") ? (
                        <span className="rounded-full bg-[var(--sp-maroon)] px-2 py-0.5 text-white">Premium</span>
                      ) : null}
                      {product.onSale ? (
                        <span className="rounded-full bg-[#a33b5c] px-2 py-0.5 text-white">Sale</span>
                      ) : null}
                      {product.isNew ? (
                        <span className="rounded-full bg-[#fff8f0] px-2 py-0.5 text-[var(--sp-maroon-deep)]">New</span>
                      ) : null}
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
                  <div className="mt-3 flex flex-1 flex-col px-0.5">
                    <h2 className="line-clamp-2 min-h-[2.6em] font-serif text-sm font-medium leading-snug text-[var(--sp-ink)] group-hover:text-[var(--sp-maroon)] sm:min-h-[2.7em] sm:text-[15px]">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--sp-muted)] sm:text-sm">
                      {formatPrice(product.price || 0)}
                      {product.onSale && Number(product.compareAtPrice) > product.price ? (
                        <del className="ml-2 text-[var(--sp-muted)]/70">{formatPrice(Number(product.compareAtPrice))}</del>
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

          {meta && meta.totalPages > 1 ? (
            <nav
              aria-label="Product pages"
              className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--sp-ink)]"
            >
              {meta.hasPrevPage ? (
                <a className="rounded-full border border-[#e6d8cc] bg-white/70 px-4 py-2 font-medium hover:border-[var(--sp-maroon)]" href={buildUrl(meta.page - 1)}>
                  Previous
                </a>
              ) : (
                <span />
              )}
              <span className="text-xs uppercase tracking-[0.14em] text-[var(--sp-muted)]">
                Page {meta.page} of {meta.totalPages}
              </span>
              {meta.hasNextPage ? (
                <a className="rounded-full border border-[#e6d8cc] bg-white/70 px-4 py-2 font-medium hover:border-[var(--sp-maroon)]" href={buildUrl(meta.page + 1)}>
                  Next
                </a>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </div>
      </section>
    </StoreShell>
  );
}
