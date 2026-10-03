import React from "react";

// Part 1: Most Worn Products
const mostWornProducts = [
  {
    id: 1,
    title: "Core Oversized Tee",
    price: "PKR 3,490",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    colors: ["bg-zinc-400", "bg-black"],
  },
  {
    id: 2,
    title: "Essential Tee",
    price: "PKR 3,490",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop",
    colors: ["bg-zinc-400", "bg-black"],
  },
  {
    id: 3,
    title: "Logo Hoodie",
    price: "PKR 5,990",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
    colors: ["bg-zinc-300", "bg-black"],
  },
  {
    id: 4,
    title: "Minimal Crewneck",
    price: "PKR 4,990",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    colors: ["bg-zinc-600", "bg-black"],
  },
];

// Part 4: Instagram Community Photos (6 images)
const communityPhotos = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&auto=format&fit=crop",
];

export default function Showcase() {
  return (
    <div className="w-full bg-white text-black">

      {/* =========================================================
          SECTION 1: MOST WORN.
          ========================================================= */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Most Worn.
          </h2>
          <a
            href="#shop"
            className="text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            View All <span>&rarr;</span>
          </a>
        </div>

        {/* 4 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mostWornProducts.map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="aspect-square bg-zinc-100 mb-3 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-contain filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-black group-hover:underline">
                {p.title}
              </h3>
              <p className="text-xs text-zinc-600 font-mono mt-1 font-semibold">
                {p.price}
              </p>
              <div className="flex gap-1.5 mt-2">
                {p.colors.map((c, i) => (
                  <span key={i} className={`w-3 h-3 rounded-full ${c}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================
          SECTION 2: MADE FOR EVERYDAY. (Banner)
          ========================================================= */}
      <section className="bg-black text-white w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left: Streetwear Photo */}
          <div className="lg:col-span-8 relative min-h-[350px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"
              alt="Everyday Collection"
              className="w-full h-full object-cover object-center filter grayscale contrast-125"
            />
          </div>

          {/* Right: Black Box with Big Text & Button */}
          <div className="lg:col-span-4 bg-black p-8 sm:p-12 flex flex-col justify-center items-start border-l border-zinc-900">
            <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-8">
              Made For <br />
              Everyday.
            </h2>
            <a
              href="#shop"
              className="px-6 py-3.5 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition"
            >
              Explore The Collection &rarr;
            </a>
          </div>

        </div>
      </section>


      {/* =========================================================
          SECTION 3: LESS NOISE. BETTER CLOTHES. (Value Points)
          ========================================================= */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-b border-zinc-200">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-12">
          Less Noise. Better Clothes.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Point 01 */}
          <div className="sm:border-r border-zinc-200 sm:pr-6">
            <span className="text-xl font-black text-black block mb-2 font-mono">01</span>
            <h3 className="text-sm font-bold uppercase text-black mb-1">Everyday Comfort</h3>
            <p className="text-xs text-zinc-500 font-medium">Made for actually wearing.</p>
          </div>

          {/* Point 02 */}
          <div className="lg:border-r border-zinc-200 lg:pr-6">
            <span className="text-xl font-black text-black block mb-2 font-mono">02</span>
            <h3 className="text-sm font-bold uppercase text-black mb-1">Easy Fits</h3>
            <p className="text-xs text-zinc-500 font-medium">Pieces that work without overthinking them.</p>
          </div>

          {/* Point 03 */}
          <div className="sm:border-r border-zinc-200 sm:pr-6">
            <span className="text-xl font-black text-black block mb-2 font-mono">03</span>
            <h3 className="text-sm font-bold uppercase text-black mb-1">Quality First</h3>
            <p className="text-xs text-zinc-500 font-medium">Fabric, fit and finish where they matter.</p>
          </div>

          {/* Point 04 */}
          <div>
            <span className="text-xl font-black text-black block mb-2 font-mono">04</span>
            <h3 className="text-sm font-bold uppercase text-black mb-1">Your Style</h3>
            <p className="text-xs text-zinc-500 font-medium">Wear it your own way.</p>
          </div>

        </div>
      </section>


      {/* =========================================================
          SECTION 4: WORN BY YOU. (Instagram Grid)
          ========================================================= */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Worn By You.
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            <span className="font-mono text-zinc-500">@SABPEHNO</span>
            <span>Follow Us On Instagram &rarr;</span>
          </a>
        </div>

        {/* 6 Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {communityPhotos.map((imgUrl, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-200 overflow-hidden group cursor-pointer">
              <img
                src={imgUrl}
                alt={`Community ${i + 1}`}
                className="w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}