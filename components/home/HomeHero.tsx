"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    title: "Sab Pehno",
    accent: "with Confidence",
    copy: "Discover premium Pakistani wear from top brands at reasonable prices.",
  },
  {
    title: "Sab Pehno",
    accent: "this Season",
    copy: "Festive embroidered suits and flowing fabrics, styled for every occasion.",
  },
  {
    title: "Sab Pehno",
    accent: "with Grace",
    copy: "Top Pakistani labels, one elegant place, prices that stay reasonable.",
  },
  {
    title: "Sab Pehno",
    accent: "every Day",
    copy: "From casual pret to formal wear — find the outfit that feels like you.",
  },
];

export default function HomeHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section id="top" className="relative bg-transparent">
      <div className="relative h-[560px] w-full sm:h-[640px] lg:h-[700px]">
        <Image
          src="/hero-sabpehno.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_18%]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#f7eee6]/25 to-[#f7eee6]/80" />
        <div className="sp-container relative z-10 flex h-full items-start pt-10 sm:pt-14 lg:pt-16">
          <div className="max-w-[34rem]">
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6e2438]">
                Branded Fashion for Everyone
              </p>
              <span className="hidden h-px w-16 bg-[#c4a484] sm:block" />
            </div>
            <h1 className="mt-4 font-serif text-5xl font-medium leading-[0.9] text-[#4e1528] sm:text-7xl lg:text-[5.5rem]">
              {slide.title}
              <span className="mt-1 block font-serif text-4xl italic sm:text-6xl lg:text-[4.2rem]">{slide.accent}</span>
            </h1>
            <p className="mt-5 max-w-[17rem] text-sm leading-relaxed text-[#5c463e] sm:text-[15px]">{slide.copy}</p>
            <a href="/new-arrival" className="sp-btn mt-6">
              Shop New Arrivals
              <span aria-hidden>→</span>
            </a>

            <div className="mt-7 flex items-center gap-3 text-[#4e1528]">
              <span className="font-serif text-sm">
                {String(index + 1).padStart(2, "0")}
                <span className="text-[#b09a90]">/{String(SLIDES.length).padStart(2, "0")}</span>
              </span>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#4e1528]/30 text-sm"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setIndex((current) => (current + 1) % SLIDES.length)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#4e1528]/30 text-sm"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-36 right-7 z-10 hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#4e1528] lg:flex">
          <span className="[writing-mode:vertical-rl]">Scroll Down</span>
          <span className="inline-flex h-9 w-5 items-start justify-center rounded-full border border-[#4e1528]/35 p-1">
            <span className="mt-0.5 h-1.5 w-1.5 animate-bounce rounded-full bg-[#4e1528]" />
          </span>
        </div>
      </div>
    </section>
  );
}
