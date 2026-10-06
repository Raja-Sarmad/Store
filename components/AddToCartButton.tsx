"use client";

import { useState } from "react";
import type { Product } from "@/lib/api";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
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
    <div className={compact ? "mt-3 flex gap-2" : "mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"}>
      {sizes.length > 0 && <select aria-label={`Choose size for ${product.name}`} value={size} onChange={(event) => setSize(event.target.value)} className="h-10 min-w-0 border border-zinc-300 bg-white px-3 text-xs uppercase tracking-wider text-black outline-none focus:border-black">
        <option value="">Choose size</option>
        {sizes.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>}
      <button type="button" onClick={add} disabled={unavailable || (sizes.length > 0 && !size)} className="h-10 flex-1 bg-black px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300">
        {unavailable ? "Sold out" : added ? "Added to bag ✓" : "Add to bag"}
      </button>
    </div>
  );
}
