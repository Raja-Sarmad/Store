import Image from "next/image";
import type { Product } from "@/lib/api";
import { productHref } from "@/lib/api";
import { formatPrice } from "@/lib/money";

function pickBadge(product: Product): string | null {
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    const pct =
      product.discountPercent ||
      Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
    if (pct > 0) return `-${pct}%`;
  }
  if (product.isNew) return "New";
  return null;
}

function subtitle(product: Product) {
  if (product.wearType === "stitched") return "3 Piece Suit";
  if (product.wearType === "unstitched") return "Unstitched";
  if (product.category) return product.category;
  if (product.brand) return product.brand;
  return "3 Piece Suit";
}

export default function HomeBestsellers({ products }: { products: Product[] }) {
  const items = products.slice(0, 5);

  return (
    <section className="bg-transparent px-4 py-10 sm:px-6 sm:py-12">
      <div className="sp-container">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7a2340]">Best Sellers</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span
              aria-hidden
              className="hidden h-px w-16 sm:block lg:w-24"
              style={{ background: "linear-gradient(90deg, transparent, #c9b09a)" }}
            />
            <h2 className="font-serif text-4xl font-medium text-[#3a241f] sm:text-5xl">Loved by Our Customers</h2>
            <span
              aria-hidden
              className="hidden h-px w-16 sm:block lg:w-24"
              style={{ background: "linear-gradient(90deg, #c9b09a, transparent)" }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#8a7368]">
            Mark products as Top Selling in the dashboard to show them here.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {items.map((product) => {
              const image = product.images?.[0] || null;
              const badge = pickBadge(product);

              return (
                <a
                  key={product._id}
                  href={productHref(product)}
                  className="group relative flex flex-col overflow-hidden rounded-[1.35rem] bg-white p-2.5 shadow-[0_14px_32px_rgba(90,40,50,0.08)]"
                >
                  <div className="relative aspect-[3/3.8] overflow-hidden rounded-[1.05rem] bg-[#f6eee6]">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="220px"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        unoptimized={image.startsWith("http")}
                      />
                    ) : null}

                    {badge ? (
                      <span className="absolute left-3 top-3 rounded-full bg-[#5c1a30] px-2.5 py-1 text-[10px] font-semibold text-white">
                        {badge}
                      </span>
                    ) : null}

                    <span
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#5c1a30] shadow-sm"
                      aria-hidden
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.6}
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-1.5 pb-10 pt-3">
                    <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#2c211c]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#8a7368]">{subtitle(product)}</p>
                    <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-semibold text-[#3a241f]">{formatPrice(product.price)}</span>
                      {product.compareAtPrice && product.compareAtPrice > product.price ? (
                        <span className="text-xs text-[#a09088] line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <span
                    className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#5c1a30] text-white shadow-sm transition group-hover:scale-105"
                    aria-hidden
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2m6 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                      />
                    </svg>
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
