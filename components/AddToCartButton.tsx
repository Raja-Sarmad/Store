"use client";

import { useState } from "react";
import type { Product } from "@/lib/api";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const sizes = product.variants?.length
    ? product.variants.filter((variant) => variant.stock > 0).map((variant) => variant.size)
    : product.sizes || [];
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [added, setAdded] = useState(false);
  const unavailable = product.variants?.length ? sizes.length === 0 : product.stock === 0;

  function add() {
    if (sizes.length && !size) return;
    addItem(product, size || undefined, product.colors?.[0]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className={compact ? "mt-3 flex w-full flex-col gap-2" : "mt-4 flex w-full flex-col gap-2 sm:flex-row"}>
      {sizes.length > 0 ? (
        <select
          aria-label={`Choose size for ${product.name}`}
          value={size}
          onChange={(event) => setSize(event.target.value)}
          className={`h-10 w-full rounded-full border border-[#e6d8cc] bg-[#fbf6f0] px-3 text-xs uppercase tracking-wider text-[var(--sp-ink)] outline-none focus:border-[var(--sp-gold)] focus:bg-white ${
            compact ? "" : "sm:w-36 sm:shrink-0"
          }`}
        >
          <option value="">Size</option>
          {sizes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
      <button
        type="button"
        onClick={add}
        disabled={unavailable || (sizes.length > 0 && !size)}
        className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full bg-[var(--sp-maroon)] px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--sp-maroon-deep)] disabled:cursor-not-allowed disabled:bg-[#cbb5aa]"
      >
        {unavailable ? "Sold out" : added ? "Added ✓" : "Add to bag"}
      </button>
    </div>
  );
}
