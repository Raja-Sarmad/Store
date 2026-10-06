import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import type { Product, Category, CatalogMeta } from "@/lib/api";
import type { CatalogFilterValues } from "@/lib/catalog";
import AddToCartButton from "@/components/AddToCartButton";

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
}) {
  const buildUrl = (page: number, category = activeCategory) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(page));
    if (category) params.set("category", category);
    return `${path}?${params}`;
  };
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      <PageHero eyebrow={eyebrow} title={title} description={copy}>
        {categories && categories.length > 0 && <nav aria-label="Product categories" className="flex w-full flex-nowrap items-center justify-between gap-2 overflow-x-auto pb-2">
            <a href={buildUrl(1, "")} aria-current={!activeCategory ? "page" : undefined} className={`shrink-0 whitespace-nowrap border px-3 py-2 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${!activeCategory ? "border-white bg-white text-black" : "border-white/40 bg-black/20 text-white hover:border-white"}`}>All categories</a>
            {categories.map(category => <a key={category._id}
              href={buildUrl(1, category.slug)}
              aria-current={activeCategory === category.slug ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap border px-3 py-2 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${activeCategory === category.slug ? "border-white bg-white text-black" : "border-white/40 bg-black/20 text-white hover:border-white"}`}>
              {category.name} ({category.count})
            </a>)}
          </nav>}
      </PageHero>
      <section className="bg-white text-black px-6 sm:px-12 py-16">
        <form action={path} method="get" className="mx-auto mb-12 max-w-7xl border-b border-zinc-200 pb-8">
          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <label className="col-span-2 flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest sm:col-span-3 lg:col-span-2">
              Search products
              <input name="search" type="search" defaultValue={filters.search} placeholder="Search by name..." className="h-11 border border-zinc-300 px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black" />
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Brand
              <input name="brand" list="catalog-brands" defaultValue={filters.brand} placeholder="Any brand" className="h-11 border border-zinc-300 px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black" />
              <datalist id="catalog-brands">
                {["Xenia", "Afrozeh", "Jazmine", "Alizeh", "Frasaha", "Farasha", "Nishat", "Sapphire", "Khaadi", "Zellbury", "Overdose"].map((brand) => <option key={brand} value={brand} />)}
              </datalist>
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Size
              <select name="size" defaultValue={filters.size || ""} className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black">
                <option value="">All sizes</option>
                {["XS", "S", "M", "L", "XL", "XXL", "One Size"].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Color
              <select name="colors" defaultValue={filters.colors || ""} className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black">
                <option value="">All colors</option>
                {["black", "white", "blue", "red", "green", "beige", "pink", "brown", "grey", "olive"].map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Outfit type
              <select name="wearType" defaultValue={filters.wearType || ""} className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black">
                <option value="">All types</option>
                <option value="stitched">Stitched</option>
                <option value="unstitched">Unstitched</option>
                <option value="modelwear">Model wear</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Min price
              <input name="minPrice" type="number" min="0" step="0.01" defaultValue={filters.minPrice} placeholder="0" className="h-11 border border-zinc-300 px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black" />
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Max price
              <input name="maxPrice" type="number" min="0" step="0.01" defaultValue={filters.maxPrice} placeholder="No limit" className="h-11 border border-zinc-300 px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black" />
            </label>
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest">
              Sort by
              <select name="sort" defaultValue={filters.sort || "-createdAt"} className="h-11 border border-zinc-300 bg-white px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black">
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
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            {[
              { name: "inStock", label: "In stock", checked: filters.inStock === "true", disabled: false },
              { name: "onSale", label: "On sale", checked: filters.onSale === "true", disabled: path === "/sales" },
              { name: "new", label: "New arrivals", checked: filters.new === "true", disabled: path === "/new-arrival" },
            ].map((filter) => (
              <label key={filter.name} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                <input type="checkbox" name={filter.name} value="true" defaultChecked={filter.checked} disabled={filter.disabled} className="h-4 w-4 accent-black disabled:opacity-50" />
                {filter.label}
              </label>
            ))}
            <div className="ml-auto flex items-center gap-4">
              <a href={path} className="text-xs font-bold uppercase tracking-wider underline underline-offset-4">Clear filters</a>
              <button type="submit" className="bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-zinc-700">Apply filters</button>
            </div>
          </div>
        </form>
        {meta && <p className="mx-auto mb-6 max-w-7xl text-xs font-mono uppercase tracking-widest text-zinc-500">Showing {products.length} of {meta.total} products</p>}
        {unavailable ? <p role="alert" className="mx-auto max-w-7xl">Products are temporarily unavailable. Please refresh to try again.</p>
          : !products.length && <p className="mx-auto max-w-7xl">No products match this selection yet. Try changing your filters or explore <a className="underline" href="/collections">all collections</a>.</p>}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <article key={product._id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                <div className="absolute left-3 top-3 z-10 flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                  {product.tags?.includes("Premium") && <span className="bg-black px-2 py-1 text-white">Premium</span>}
                  {product.onSale && <span className="bg-red-700 px-2 py-1 text-white">Sale</span>}
                  {product.isNew && <span className="bg-white px-2 py-1 text-black">New</span>}
                </div>
                <img
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-xs font-black uppercase tracking-wider">
                  {product.name}
                </h2>
                <p className="mt-1 text-xs font-mono text-zinc-600">
                  ${Number(product.price || 0).toFixed(2)} USD
                  {product.onSale && Number(product.compareAtPrice) > product.price && <del className="ml-2 text-zinc-400">${Number(product.compareAtPrice).toFixed(2)}</del>}
                </p>
                <AddToCartButton product={product} compact />
              </div>
            </article>
          ))}
        </div>
        {meta && meta.totalPages > 1 && <nav aria-label="Product pages" className="mx-auto mt-12 flex max-w-7xl items-center justify-between text-sm">
          {meta.hasPrevPage ? <a className="underline" href={buildUrl(meta.page - 1)}>Previous</a> : <span />}
          <span>Page {meta.page} of {meta.totalPages} · {meta.total} products</span>
          {meta.hasNextPage ? <a className="underline" href={buildUrl(meta.page + 1)}>Next</a> : <span />}
        </nav>}
      </section>
      <Footer />
    </main>
  );
}
