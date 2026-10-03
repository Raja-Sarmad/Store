import React from "react";

const products = [
  {
    id: 1,
    tag: "NEW",
    title: "HEAVYWEIGHT OVERSIZED TEE",
    price: "$45.00 USD",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    colors: ["bg-black", "bg-zinc-300"],
  },
  {
    id: 2,
    tag: "HOT",
    title: "VINTAGE WASH LOGO TEE",
    price: "$40.00 USD",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    colors: ["bg-white border border-zinc-300", "bg-black"],
  },
  {
    id: 3,
    tag: "OVERSIZED",
    title: "SIGNATURE HOODIE V.01",
    price: "$85.00 USD",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    colors: ["bg-black", "bg-zinc-700"],
  },
  {
    id: 4,
    tag: "LIMITED",
    title: "ACID WASH CREWNECK",
    price: "$75.00 USD",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    colors: ["bg-zinc-800", "bg-zinc-400"],
  },
];

export default function Shop() {
  return (
    <section id="shop" className="w-full bg-white text-black py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header: Title & View All Link --- */}
        <div className="flex items-end justify-between border-b-2 border-black pb-4 mb-10">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
              Fresh Arrivals // 2024
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Shop What&apos;s New.
            </h2>
          </div>
          
          <a
            href="#collection"
            className="text-xs sm:text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            View All <span>&rarr;</span>
          </a>
        </div>

        {/* --- Product Grid (4 Columns) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              
              {/* Product Image Container */}
              <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden mb-4">
                {/* Badge Tag (NEW, HOT, etc.) */}
                <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-black tracking-widest uppercase px-2 py-1">
                  {item.tag}
                </span>

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black group-hover:underline">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-zinc-600 font-mono">
                  {item.price}
                </p>

                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 pt-2">
                  {item.colors.map((color, index) => (
                    <span
                      key={index}
                      className={`w-3.5 h-3.5 rounded-none ${color}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}