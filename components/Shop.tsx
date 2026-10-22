"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/api";
import { productHref } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";
import { STORE_BRANDS, brandHref } from "@/lib/brands";

const swatchClass: Record<string, string> = {
  black: "bg-black",
  white: "bg-white border border-zinc-300",
  gray: "bg-zinc-600",
  grey: "bg-zinc-600",
  silver: "bg-zinc-300",
};

function productTag(product: Product) {
  if (product.isBestSeller || (product.totalSold ?? 0) > 0) return "BEST SELLER";
  if (product.onSale) return "SALE";
  if (product.isNew) return "NEW";
  if (product.isFeatured) return "HOT";
  return "DROP";
}

export default function Shop({ products, unavailable = false }: { products: Product[]; unavailable?: boolean }) {
  const [brandPage, setBrandPage] = useState(0);
  const items = products.slice(0, 4);

  return (
    <>
      <section aria-labelledby="brand-heading" className="w-full overflow-hidden border-y border-zinc-200 bg-white py-10 text-black sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5 flex items-end justify-between gap-4 px-6 sm:mb-6">
            <div>
              <span className="block mb-1 text-[10px] uppercase font-mono tracking-[0.28em] text-zinc-500">Explore our labels</span>
              <h2 id="brand-heading" className="text-xl sm:text-2xl font-black uppercase tracking-tight">Shop by brand</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous brands"
                onClick={() => setBrandPage(0)}
                disabled={brandPage === 0}
                className="brand-slider__arrow"
              >
                &larr;
              </button>
              <button
                type="button"
                aria-label="Next brands"
                onClick={() => setBrandPage(1)}
                disabled={brandPage === 1}
                className="brand-slider__arrow"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="brand-slider" aria-label="Shop by brand">
            <div className="brand-slider__track" style={{ transform: `translateX(-${brandPage * 50}%)` }}>
              {[STORE_BRANDS.slice(0, 5), STORE_BRANDS.slice(5)].map((brandPageItems, pageIndex) => (
                <div key={pageIndex} className="brand-slider__page" aria-hidden={brandPage !== pageIndex}>
                  {brandPageItems.map((brand) => (
                    <a
                      key={brand.slug}
                      href={brandHref(brand)}
                      aria-label={`Shop ${brand.name} products`}
                      tabIndex={brandPage === pageIndex ? 0 : -1}
                      className="brand-slider__item"
                    >
                      {brand.logo ? (
                        <Image src={brand.logo} alt={`${brand.name} logo`} width={180} height={88} className="relative z-10 h-14 w-full max-w-44 object-contain sm:h-16" />
                      ) : (
                        <span className={`relative z-10 font-serif font-semibold ${brand.name === "Khaadi" ? "text-[9px] tracking-[0.08em] sm:text-2xl sm:tracking-[0.16em]" : "text-[10px] tracking-[0.08em] sm:text-xl sm:tracking-[0.12em]"}`}>
                          {brand.name === "Khaadi" ? "KHAADI" : brand.name}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="w-full bg-white text-black py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">

        {/* --- Header: Title & View All Link --- */}
        <div className="flex items-end justify-between border-b-2 border-black pb-4 mb-10">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
              The most-loved edit
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Best Sellers.
            </h2>
          </div>

          <a
            href="/collections"
            className="text-xs sm:text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            View All <span>&rarr;</span>
          </a>
        </div>

        {unavailable ? <p role="alert">Products are temporarily unavailable. Please refresh to try again.</p>
          : !items.length && <p>Our most-loved dresses will appear here soon.</p>}
        {/* --- Product Grid (4 Columns) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item._id} className="group">
              <a href={productHref(item)} className="block">
                <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                  <span className="absolute left-3 top-3 z-10 bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    {productTag(item)}
                  </span>
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"}
                    alt={item.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black group-hover:underline">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-zinc-600">
                    ${Number(item.price || 0).toFixed(2)} USD
                  </p>
                  <div className="flex items-center gap-1.5 pt-2">
                    {(item.colors?.length ? item.colors : ["black", "gray"]).slice(0, 3).map((color, index) => (
                      <span
                        key={index}
                        className={`h-3.5 w-3.5 rounded-none ${swatchClass[color.toLowerCase()] || "bg-zinc-400"}`}
                      />
                    ))}
                  </div>
                </div>
              </a>
              <AddToCartButton product={item} compact />
            </div>
          ))}
        </div>

      </div>
      </section>
    </>
  );
}
