"use client";

import { useRef } from "react";
import Image from "next/image";

const CATEGORIES = [
  {
    label: "Women's Collection",
    href: "/women",
    image: "/categories/cat-women.jpg",
  },
  {
    label: "Men's Collection",
    href: "/men",
    image: "/categories/cat-men.jpg",
  },
  {
    label: "Festive Wear",
    href: "/collections",
    image: "/categories/cat-festive.jpg",
  },
  {
    label: "Casual Wear",
    href: "/collections",
    image: "/categories/cat-casual.jpg",
  },
  {
    label: "Formal Wear",
    href: "/premium",
    image: "/categories/cat-formal.jpg",
  },
  {
    label: "Sale Collection",
    href: "/sales",
    image: "/categories/cat-sale.jpg",
  },
];

export default function HomeCategories() {
  const scroller = useRef<HTMLDivElement>(null);
  const move = (dir: number) => scroller.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <section className="relative bg-transparent px-4 pb-4 pt-16 sm:px-6 sm:pb-6 sm:pt-20">
      <div className="sp-container relative">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7a2340]">Shop by Category</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="hidden h-px w-14 bg-[#d7bda8] sm:block" aria-hidden />
            <h2 className="font-serif text-4xl font-medium text-[#2c211c] sm:text-5xl">Find Your Perfect Style</h2>
            <span className="hidden h-px w-14 bg-[#d7bda8] sm:block" aria-hidden />
          </div>
        </div>

        <div className="relative mt-10 lg:px-14">
          <button
            type="button"
            aria-label="Previous categories"
            onClick={() => move(-1)}
            className="absolute left-0 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#5c1a30] text-lg text-white shadow-md lg:grid"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next categories"
            onClick={() => move(1)}
            className="absolute right-0 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#5c1a30] text-lg text-white shadow-md lg:grid"
          >
            ›
          </button>

          <div
            ref={scroller}
            className="flex gap-4 overflow-x-auto px-1 pb-2 sm:gap-5 lg:grid lg:grid-cols-6 lg:overflow-visible"
          >
            {CATEGORIES.map((category) => (
              <a key={category.label} href={category.href} className="group w-[9.5rem] shrink-0 lg:w-auto">
                <div className="relative mx-auto aspect-[3/4.15] w-full overflow-hidden rounded-t-[999px] rounded-b-[1.15rem] bg-[#f3e7dc] shadow-[0_16px_34px_rgba(90,40,50,0.1)]">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    sizes="180px"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2c211c]/35 via-[#2c211c]/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 border-t border-white/55 bg-[#fffaf6]/78 px-2.5 py-3.5 text-center shadow-[0_-6px_18px_rgba(80,40,40,0.05)] backdrop-blur-md">
                    <p className="text-[12px] font-semibold leading-snug text-[#2c211c] sm:text-[13px]">
                      {category.label} <span aria-hidden>→</span>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
