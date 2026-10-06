"use client";

import { useCart } from "@/components/CartProvider";

export default function CartIcon() {
  const { count, ready } = useCart();
  return (
    <a href="/cart" aria-label={`Shopping bag${count ? `, ${count} items` : ""}`} className="relative inline-flex hover:text-zinc-400">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {ready && count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[9px] font-bold text-black">{count}</span>}
    </a>
  );
}
