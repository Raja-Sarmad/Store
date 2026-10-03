import React from "react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="text-2xl font-black tracking-widest text-white uppercase italic">
          OVER<span className="text-zinc-500">DOSE</span>
        </a>

        {/* Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider text-zinc-300">
          <a href="#home" className="hover:text-white transition">HOME</a>
          <a href="#shop" className="hover:text-white transition">SHOP</a>
          <a href="#about" className="hover:text-white transition">ABOUT</a>
          <a href="#collection" className="hover:text-white transition">COLLECTION</a>
          <a href="#contact" className="hover:text-white transition">CONTACT</a>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-5 text-white">
          {/* Search Icon */}
          <button aria-label="Search" className="hover:text-zinc-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Cart Icon */}
          <button aria-label="Cart" className="hover:text-zinc-400 relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}