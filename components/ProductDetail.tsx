"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/api";
import { productHref } from "@/lib/api";
import { useCart } from "@/components/CartProvider";

const COLOR_SWATCH: Record<string, string> = {
  black: "bg-black",
  white: "bg-white border border-zinc-300",
  gray: "bg-zinc-500",
  grey: "bg-zinc-500",
  silver: "bg-zinc-300",
  red: "bg-red-600",
  blue: "bg-blue-600",
  green: "bg-emerald-700",
  beige: "bg-amber-100 border border-zinc-300",
  pink: "bg-pink-400",
  brown: "bg-amber-800",
  olive: "bg-lime-800",
  navy: "bg-indigo-950",
};

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(2)} USD`;
}

function wearLabel(wear?: string) {
  if (wear === "stitched") return "Stitched";
  if (wear === "unstitched") return "Unstitched";
  if (wear === "modelwear") return "Model wear";
  return "";
}

function specEntries(specs?: Product["specifications"]) {
  if (!specs || typeof specs !== "object") return [];
  return Object.entries(specs).filter(([, value]) => String(value || "").trim());
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const images = useMemo(() => {
    const list = (product.images || []).filter(Boolean);
    return list.length ? list : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop"];
  }, [product.images]);

  const sizes = useMemo(() => {
    if (product.variants?.length) {
      return product.variants.map((variant) => ({
        size: variant.size,
        stock: Math.max(0, variant.stock ?? 0),
      }));
    }
    return (product.sizes || []).map((size) => ({
      size,
      stock: product.stock == null ? 1 : Math.max(0, product.stock),
    }));
  }, [product.variants, product.sizes, product.stock]);

  const availableSizes = sizes.filter((row) => row.stock > 0);
  const colors = product.colors?.length ? product.colors : [];

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(availableSizes.length === 1 ? availableSizes[0].size : "");
  const [color, setColor] = useState(colors.length === 1 ? colors[0] : "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"details" | "size" | "shipping">("details");

  const soldOut = product.variants?.length
    ? availableSizes.length === 0
    : product.stock === 0;
  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 1;
  const canAdd = !soldOut && (!needsSize || !!size) && (!needsColor || !!color);

  const compare = Number(product.compareAtPrice || 0);
  const onSale = product.onSale && compare > product.price;
  const related = (product.related || []).filter((item) => item._id !== product._id).slice(0, 4);
  const specs = specEntries(product.specifications);

  function addToBag() {
    if (!canAdd) return;
    for (let i = 0; i < qty; i += 1) {
      addItem(product, size || undefined, color || colors[0]);
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:px-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                {product.tags?.includes("Premium") && (
                  <span className="bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Premium
                  </span>
                )}
                {onSale && (
                  <span className="bg-red-700 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Sale
                    {product.discountPercent ? ` · ${product.discountPercent}%` : ""}
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-zinc-900 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Best seller
                  </span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {images.map((src, index) => (
                  <li key={`${src}-${index}`}>
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      className={`aspect-[3/4] w-full overflow-hidden border bg-zinc-100 ${
                        activeImage === index ? "border-black" : "border-transparent hover:border-zinc-400"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buy box */}
          <div className="flex min-w-0 flex-col lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
              {[product.brand, product.category, wearLabel(product.wearType)].filter(Boolean).join(" · ") || "Sab Pehno"}
            </p>
            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="font-mono text-lg font-semibold">{formatMoney(product.price)}</p>
              {onSale && (
                <p className="font-mono text-sm text-zinc-400 line-through">{formatMoney(compare)}</p>
              )}
            </div>

            {(product.rating || 0) > 0 && (
              <p className="mt-2 text-xs uppercase tracking-wider text-zinc-600">
                ★ {Number(product.rating).toFixed(1)}
                {product.reviewsCount ? ` · ${product.reviewsCount} reviews` : ""}
                {product.totalSold ? ` · ${product.totalSold} sold` : ""}
              </p>
            )}

            {product.description ? (
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-700 whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-600">
                Crafted for everyday confidence. Check materials, size guide, and shipping below —
                everything managed from the Sab Pehno dashboard.
              </p>
            )}

            {colors.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Color{color ? ` · ${color}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose color">
                  {colors.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setColor(option)}
                      title={option}
                      aria-pressed={color === option}
                      className={`h-9 min-w-9 border px-3 text-[10px] font-bold uppercase tracking-wider ${
                        color === option ? "border-black bg-black text-white" : "border-zinc-300 bg-white text-black hover:border-black"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`h-3 w-3 ${COLOR_SWATCH[option.toLowerCase()] || "bg-zinc-400"}`}
                          aria-hidden
                        />
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Size</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose size">
                  {sizes.map((row) => {
                    const disabled = row.stock <= 0;
                    const active = size === row.size;
                    return (
                      <button
                        key={row.size}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSize(row.size)}
                        className={`min-w-12 border px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                          disabled
                            ? "cursor-not-allowed border-zinc-200 text-zinc-300 line-through"
                            : active
                              ? "border-black bg-black text-white"
                              : "border-zinc-300 bg-white hover:border-black"
                        }`}
                      >
                        {row.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label className="flex items-center border border-zinc-300">
                <span className="sr-only">Quantity</span>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="h-12 w-10 text-lg hover:bg-zinc-50"
                >
                  −
                </button>
                <span className="min-w-8 text-center font-mono text-sm">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((value) => Math.min(10, value + 1))}
                  className="h-12 w-10 text-lg hover:bg-zinc-50"
                >
                  +
                </button>
              </label>

              <button
                type="button"
                onClick={addToBag}
                disabled={!canAdd}
                className="h-12 flex-1 bg-black px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:min-w-[14rem]"
              >
                {soldOut
                  ? "Sold out"
                  : needsSize && !size
                    ? "Select a size"
                    : needsColor && !color
                      ? "Select a color"
                      : added
                        ? "Added to bag ✓"
                        : "Add to bag"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              {product.sku && <span>SKU {product.sku}</span>}
              {product.gender && <span>{product.gender}</span>}
              {wearLabel(product.wearType) && <span>{wearLabel(product.wearType)}</span>}
              {!soldOut && <span className="text-emerald-700">In stock</span>}
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-zinc-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href="/collections"
              className="mt-8 inline-flex text-xs font-bold uppercase tracking-widest underline underline-offset-4"
            >
              ← Back to collections
            </a>
          </div>
        </div>
      </section>

      {/* Details from dashboard */}
      <section className="border-t border-zinc-200 bg-zinc-50 text-black">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12">
          <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
            {(
              [
                ["details", "Details"],
                ["size", "Size guide"],
                ["shipping", "Shipping"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${
                  tab === key ? "bg-black text-white" : "bg-white text-zinc-600 hover:text-black"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {tab === "details" && (
              <>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Product story</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-700">
                    {product.description?.trim() || "No description yet — add one in the dashboard and it will show here."}
                  </p>
                  {product.materials?.trim() && (
                    <div className="mt-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Materials
                      </h3>
                      <p className="mt-2 whitespace-pre-line text-sm text-zinc-700">{product.materials}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-8">
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Features
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex gap-3 text-sm text-zinc-700">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" aria-hidden />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {specs.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Specifications
                      </h3>
                      <dl className="mt-3 divide-y divide-zinc-200 border border-zinc-200 bg-white">
                        {specs.map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                            <dt className="font-bold uppercase tracking-wider text-zinc-500">{key}</dt>
                            <dd className="text-zinc-800">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === "size" && (
              <div className="lg:col-span-2">
                <h2 className="text-xl font-black uppercase tracking-tight">Size guide</h2>
                <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-700">
                  {product.sizeGuide?.trim() ||
                    "No size guide yet. Add measurements in the dashboard Size guide field and they appear here for shoppers."}
                </p>
                {sizes.length > 0 && (
                  <p className="mt-6 text-xs font-mono uppercase tracking-widest text-zinc-500">
                    Available: {availableSizes.map((row) => row.size).join(" · ") || "Sold out"}
                  </p>
                )}
              </div>
            )}

            {tab === "shipping" && (
              <div className="lg:col-span-2">
                <h2 className="text-xl font-black uppercase tracking-tight">Shipping & returns</h2>
                <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-700">
                  {product.shippingInfo?.trim() ||
                    "Standard delivery details will show here once you fill Shipping info on this product in the dashboard."}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
                  <a href="/delivery" className="underline underline-offset-4">
                    Delivery
                  </a>
                  <a href="/returns" className="underline underline-offset-4">
                    Returns
                  </a>
                  <a href="/size-guide" className="underline underline-offset-4">
                    Full size guide
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-zinc-200 bg-white text-black">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12">
            <div className="mb-10 flex items-end justify-between border-b-2 border-black pb-4">
              <div>
                <span className="mb-1 block text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
                  More from the edit
                </span>
                <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">You may also like.</h2>
              </div>
              <a href="/collections" className="text-xs font-bold uppercase tracking-widest hover:underline">
                View all →
              </a>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <a key={item._id} href={productHref(item)} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                    <img
                      src={item.images?.[0] || images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 text-xs font-black uppercase tracking-wider group-hover:underline">
                    {item.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-zinc-600">{formatMoney(item.price)}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
