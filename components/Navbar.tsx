"use client";

import React, { useEffect, useState } from "react";
import { getMe, getToken } from "@/lib/api";
import CartIcon from "@/components/CartIcon";

export default function Navbar() {
  const [accountHref, setAccountHref] = useState("/login");
  const [accountLabel, setAccountLabel] = useState("Login");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getMe(token)
      .then(() => {
        setAccountHref("/account");
        setAccountLabel("Account");
      })
      .catch(() => {
        setAccountHref("/login");
        setAccountLabel("Login");
      });
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="/" className="text-2xl font-black tracking-widest text-white uppercase italic">
          OVER<span className="text-zinc-500">DOSE</span>
        </a>

        {/* Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider text-zinc-300">
          <a href="/men" className="hover:text-white transition">MEN</a>
          <a href="/women" className="hover:text-white transition">WOMEN</a>
          <a href="/premium" className="hover:text-white transition">PREMIUM</a>
          <a href="/collections" className="hover:text-white transition">COLLECTIONS</a>
          <a href="/sales" className="hover:text-white transition">SALES</a>
          <a href="/new-arrival" className="hover:text-white transition">NEW ARRIVAL</a>
          <a href="/contact-us" className="hover:text-white transition">CONTACT US</a>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-5 text-white">
          {/* Search Icon */}
          <a href={accountHref} aria-label={accountLabel} className="hover:text-zinc-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0" />
            </svg>
          </a>

          {/* Cart Icon */}
          <CartIcon />
        </div>

      </div>
    </header>
  );
}
