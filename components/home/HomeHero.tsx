"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SpBtnText from "@/components/SpBtnText";

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
      <div className="relative h-[520px] w-full sm:h-[640px] lg:h-[700px]">
        <Image
          src="/hero-sabpehno.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_16%] sm:object-[78%_18%]"
        />
        {/* Mobile: left/top wash for contrast — no content box */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f7eee6]/80 via-[#f7eee6]/45 to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f7eee6]/55 via-transparent to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#f7eee6]/35 to-[#f7eee6]/90 sm:h-32 sm:via-[#f7eee6]/25 sm:to-[#f7eee6]/80" />
        <div className="sp-container relative z-10 flex h-full items-start pt-8 sm:pt-14 lg:pt-16">
          <div className="max-w-[34rem]">
            <div className="flex items-center gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6e2438] [text-shadow:0_1px_0_rgba(255,248,240,0.85)]">
                Branded Fashion for Everyone
              </p>
              <span className="hidden h-px w-16 bg-[#c4a484] sm:block" />
            </div>
            <h1 className="mt-4 font-serif text-[2.65rem] font-medium leading-[0.92] text-[#4e1528] [text-shadow:0_1px_2px_rgba(255,248,240,0.9)] sm:text-7xl sm:[text-shadow:none] lg:text-[5.5rem]">
              {slide.title}
              <span className="mt-1 block font-serif text-[2.05rem] italic sm:text-6xl lg:text-[4.2rem]">
                {slide.accent}
              </span>
            </h1>
            <p className="mt-4 max-w-[18rem] text-sm leading-relaxed text-[#3f2c26] [text-shadow:0_1px_0_rgba(255,248,240,0.85)] sm:mt-5 sm:max-w-[17rem] sm:text-[15px] sm:text-[#5c463e] sm:[text-shadow:none]">
              {slide.copy}
            </p>
            <a href="/new-arrival" className="sp-btn mt-5 sm:mt-6">
              <SpBtnText>
                Shop New Arrivals
                <span aria-hidden>→</span>
              </SpBtnText>
            </a>

            <div className="mt-6 flex items-center gap-3 text-[#4e1528] sm:mt-7">
              <span className="font-serif text-sm">
                {String(index + 1).padStart(2, "0")}
                <span className="text-[#b09a90]">/{String(SLIDES.length).padStart(2, "0")}</span>
              </span>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#4e1528]/30 bg-[#fff8f0]/40 text-sm sm:bg-transparent"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setIndex((current) => (current + 1) % SLIDES.length)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#4e1528]/30 bg-[#fff8f0]/40 text-sm sm:bg-transparent"
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
