import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[650px] flex items-center bg-black overflow-hidden"
    >
      {/* --- Background Image (Aapki public folder wali image) --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero image.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark Shadow taake left side ka text bilkul saaf nazar aaye */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* --- Hero Content (Left Side Text & Buttons) --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full pt-16">
        <div className="max-w-xl">
          
          {/* Top Small Tag */}
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] text-zinc-400 uppercase font-mono mb-4">
            <span>SEASON 2024</span>
            <span className="text-zinc-600">//</span>
            <span>OVERSIZED DROP</span>
          </div>

          {/* Main Big Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] drop-shadow-md">
            Wear <br />
            What Feels <br />
            Like You.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base text-zinc-300 font-light tracking-wide max-w-md">
            Every piece tells a story. Redefine your style with heavy fabrics and oversized cuts.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* White Button */}
            <a
              href="#shop"
              className="px-8 py-3.5 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition duration-300 cursor-pointer shadow-lg"
            >
              Shop Now
            </a>

            {/* Transparent Border Button */}
            <a
              href="#collection"
              className="px-8 py-3.5 bg-transparent text-white border border-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition duration-300 cursor-pointer"
            >
              View Lookbook
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}