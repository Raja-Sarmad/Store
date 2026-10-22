"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/api";
import { productHref } from "@/lib/api";
import { useCart } from "@/components/CartProvider";

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function wearLabel(wear?: string) {
  if (wear === "stitched") return "STITCHED";
  if (wear === "unstitched") return "UNSTITCHED";
  if (wear === "modelwear") return "MODEL WEAR";
  return "";
}

function whatsappHref(product: Product) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hi, I want to order: ${product.name}${product.sku ? ` (${product.sku})` : ""}.`,
  );
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-zinc-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-xs font-bold uppercase tracking-[0.18em]"
      >
        {title}
        <span className={`text-lg leading-none transition ${open ? "rotate-180" : ""}`} aria-hidden>
          ⌄
        </span>
      </button>
      {open ? <div className="pb-5 text-sm leading-relaxed text-zinc-600">{children}</div> : null}
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const images = useMemo(() => {
    const list = (product.images || []).filter(Boolean);
    return list.length
      ? list
      : [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
        ];
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
  const typeLabel = wearLabel(product.wearType);

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(availableSizes.length === 1 ? availableSizes[0].size : "");
  const [color, setColor] = useState(colors.length === 1 ? colors[0] : "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openPanel, setOpenPanel] = useState<"description" | "note" | "shipping" | null>("description");

  const soldOut = product.variants?.length
    ? availableSizes.length === 0
    : product.stock === 0;
  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 1;
  const canAdd = !soldOut && (!needsSize || !!size) && (!needsColor || !!color);

  const compare = Number(product.compareAtPrice || 0);
  const onSale = Boolean(product.onSale && compare > product.price);
  const saved = onSale ? compare - product.price : 0;
  const related = (product.related || []).filter((item) => item._id !== product._id).slice(0, 4);

  const productNote = [
    product.materials?.trim(),
    product.features?.length ? product.features.map((f) => `• ${f}`).join("\n") : "",
    product.sku ? `SKU: ${product.sku}` : "",
    product.brand ? `Brand: ${product.brand}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  function addToBag() {
    if (!canAdd) return;
    for (let i = 0; i < qty; i += 1) {
      addItem(product, size || undefined, color || colors[0]);
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  function buyNow() {
    if (!canAdd) return;
    for (let i = 0; i < qty; i += 1) {
      addItem(product, size || undefined, color || colors[0]);
    }
    router.push("/checkout");
  }

  function togglePanel(panel: "description" | "note" | "shipping") {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  return (
    <>
      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-12 lg:py-12">
          {/* Gallery — thumbs + main (Alizeh-style) */}
          <div className="min-w-0">
            <div className="flex gap-3">
              {images.length > 1 && (
                <ul className="hidden w-16 shrink-0 flex-col gap-2 sm:flex lg:w-20">
                  {images.map((src, index) => (
                    <li key={`${src}-${index}`}>
                      <button
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`aspect-[3/4] w-full overflow-hidden border bg-zinc-100 ${
                          activeImage === index
                            ? "border-black"
                            : "border-transparent hover:border-zinc-400"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="relative min-w-0 flex-1 overflow-hidden bg-zinc-100">
                <div className="relative aspect-[3/4] w-full">
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                {onSale && (
                  <span className="absolute left-3 top-3 bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <ul className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
                {images.map((src, index) => (
                  <li key={`m-${src}-${index}`} className="w-16 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`aspect-[3/4] w-full overflow-hidden border ${
                        activeImage === index ? "border-black" : "border-zinc-200"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buy panel */}
          <div className="flex min-w-0 flex-col lg:pt-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {onSale && (
                <span className="text-base text-zinc-500 line-through">{formatMoney(compare)}</span>
              )}
              <span className={`text-xl font-medium ${onSale ? "text-red-600" : "text-zinc-900"}`}>
                {formatMoney(product.price)}
              </span>
            </div>
            {onSale && saved > 0 && (
              <p className="mt-1 text-sm text-zinc-500">Save {formatMoney(saved)}</p>
            )}

            <a
              href="/size-guide"
              className="mt-5 inline-flex w-fit items-center gap-2 border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-black"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M3 8h18v8H3z" />
                <path d="M7 8v3M11 8v2M15 8v3M19 8v2" />
              </svg>
              Size chart
            </a>

            {/* TYPE — only the product's wear type from dashboard */}
            {typeLabel ? (
              <div className="mt-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Type
                </p>
                <div className="mt-2">
                  <span className="inline-flex min-w-[8.5rem] items-center justify-center border-2 border-zinc-900 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em]">
                    {typeLabel}
                  </span>
                </div>
              </div>
            ) : null}

            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Color{color ? `: ${color}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setColor(option)}
                      aria-pressed={color === option}
                      className={`border px-3 py-2 text-xs uppercase tracking-wider ${
                        color === option
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-300 hover:border-zinc-900"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Size
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((row) => {
                    const disabled = row.stock <= 0;
                    const active = size === row.size;
                    return (
                      <button
                        key={row.size}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSize(row.size)}
                        className={`min-w-11 border px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                          disabled
                            ? "cursor-not-allowed border-zinc-200 text-zinc-300 line-through"
                            : active
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-300 hover:border-zinc-900"
                        }`}
                      >
                        {row.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Quantity
              </p>
              <div className="mt-2 inline-flex items-center border border-zinc-300">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="h-11 w-11 text-lg text-zinc-700 hover:bg-zinc-50"
                >
                  −
                </button>
                <span className="min-w-10 text-center text-sm">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((value) => Math.min(10, value + 1))}
                  className="h-11 w-11 text-lg text-zinc-700 hover:bg-zinc-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={addToBag}
                disabled={!canAdd}
                className="h-12 w-full bg-zinc-900 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {soldOut
                  ? "Sold out"
                  : needsSize && !size
                    ? "Select a size"
                    : needsColor && !color
                      ? "Select a color"
                      : added
                        ? "Added to cart ✓"
                        : "Add to cart"}
              </button>
              <button
                type="button"
                onClick={buyNow}
                disabled={!canAdd}
                className="h-12 w-full bg-zinc-900 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                Buy it now
              </button>
            </div>

            <div className="mt-8 border border-zinc-200 bg-zinc-50 px-4 py-5 text-center">
              <p className="text-sm font-medium text-zinc-800">Ask about this product</p>
              <p className="mt-1 text-xs text-zinc-500">
                Have questions? Contact us via WhatsApp.
              </p>
              <a
                href={whatsappHref(product)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#25D366] text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#1ebe57]"
              >
                <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M16.02 3a12.8 12.8 0 0 0-10.9 19.52L3.4 29l6.64-1.68A12.9 12.9 0 1 0 16.02 3Zm0 23.4c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.95 1 1.02-3.85-.25-.4A10.44 10.44 0 1 1 16.02 26.4Zm5.73-7.82c-.31-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.02-.99 1.23-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.52-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.2.05-.39-.03-.55-.08-.15-.7-1.7-.96-2.33-.25-.61-.51-.53-.7-.54l-.6-.01c-.21 0-.55.08-.84.39-.28.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.15.21 2.22 3.38 5.37 4.74.75.32 1.34.51 1.8.65.76.24 1.45.2 2 .12.61-.09 1.86-.76 2.12-1.5.26-.75.26-1.39.18-1.52-.08-.14-.29-.22-.6-.37Z" />
                </svg>
                Order on WhatsApp
              </a>
            </div>

            <div className="mt-8">
              <Accordion
                title="Description"
                open={openPanel === "description"}
                onToggle={() => togglePanel("description")}
              >
                <p className="whitespace-pre-line">
                  {product.description?.trim() ||
                    "Product description will appear here once added in the dashboard."}
                </p>
              </Accordion>
              <Accordion
                title="Product note"
                open={openPanel === "note"}
                onToggle={() => togglePanel("note")}
              >
                <p className="whitespace-pre-line">
                  {productNote ||
                    "Materials, features, and SKU notes from the dashboard show here."}
                </p>
              </Accordion>
              <Accordion
                title="Shipping information"
                open={openPanel === "shipping"}
                onToggle={() => togglePanel("shipping")}
              >
                <p className="whitespace-pre-line">
                  {product.shippingInfo?.trim() ||
                    product.sizeGuide?.trim() ||
                    "Shipping details from the dashboard appear here. See Delivery & Returns for policies."}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest">
                  <a href="/delivery" className="underline underline-offset-4">
                    Delivery
                  </a>
                  <a href="/returns" className="underline underline-offset-4">
                    Returns
                  </a>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-zinc-200 bg-white text-black">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-12">
            <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
              You may also like
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <a key={item._id} href={productHref(item)} className="group block">
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-100">
                    <img
                      src={item.images?.[0] || images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-zinc-900 group-hover:underline">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">{formatMoney(item.price)}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
