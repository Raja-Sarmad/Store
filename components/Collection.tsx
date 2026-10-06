import React from "react";

export default function Collection() {
  return (
    <section className="w-full bg-black text-white">
      
      {/* =========================================
          PART 1: MEN & WOMEN CARDS (Collection)
          ========================================= */}
      <div id="collection" className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
        
        {/* --- MEN CARD --- */}
        <div className="relative min-h-[440px] sm:min-h-[520px] bg-zinc-900 overflow-hidden flex items-center justify-start p-8 sm:p-12 group cursor-pointer">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop"
            alt="Men Collection"
            className="absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          {/* Text & Button */}
          <div className="relative z-10 max-w-sm">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-none mb-2">
              Men
            </h2>
            <p className="text-xs sm:text-sm uppercase font-mono tracking-widest text-zinc-300 mb-6">
              Everyday Essentials
            </p>
            <a
              href="/men"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition duration-300"
            >
              Shop Men <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* --- WOMEN CARD --- */}
        <div className="relative min-h-[440px] sm:min-h-[520px] bg-zinc-900 overflow-hidden flex items-center justify-start p-8 sm:p-12 group cursor-pointer">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
            alt="Women Collection"
            className="absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          {/* Text & Button */}
          <div className="relative z-10 max-w-sm">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-none mb-2">
              Women
            </h2>
            <p className="text-xs sm:text-sm uppercase font-mono tracking-widest text-zinc-300 mb-6">
              Effortless Everyday Style
            </p>
            <a
              href="/women"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition duration-300"
            >
              Shop Women <span>&rarr;</span>
            </a>
          </div>
        </div>

      </div>

      {/* =========================================
          PART 2: NO RULES. JUST WEAR IT. (About Banner)
          ========================================= */}
      <div id="about" className="relative min-h-[550px] w-full flex items-center bg-black overflow-hidden border-t border-zinc-900 px-6 sm:px-12 py-16">
        
        {/* Background Image (Right Side Model) */}
        <div className="absolute inset-0 flex justify-end">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"
            alt="Sabpehno Brand"
            className="w-full md:w-3/5 h-full object-cover object-center filter grayscale contrast-125 brightness-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Content (Left Aligned) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-xl">
            {/* Small Brand Tag */}
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400 block mb-3">
              SABPEHNO
            </span>

            {/* Big Headline */}
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.95] text-white mb-6">
              No Rules. <br />
              Just Wear It.
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-300 font-light tracking-wide max-w-md mb-8">
              Clothes aren&apos;t supposed to tell you who to be. <br className="hidden sm:block" />
              They&apos;re supposed to feel like you.
            </p>

            {/* Transparent Border Button */}
            <a
              href="#shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition duration-300"
            >
              Discover Sabpehno <span>&rarr;</span>
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
