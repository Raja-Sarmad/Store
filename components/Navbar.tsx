"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getMe, getToken } from "@/lib/api";
import { useCart } from "@/components/CartProvider";
import SpBtnText from "@/components/SpBtnText";
import { WHATSAPP_DISPLAY, whatsappHref } from "@/lib/whatsapp";

const CONTACT_EMAIL = "sabpehno@gmail.com";

const SHOP_LINKS = [
  { href: "/collections", label: "Shop All" },
  { href: "/men", label: "Men's Collection" },
  { href: "/women", label: "Women's Collection" },
  { href: "/new-arrival", label: "New Arrivals" },
  { href: "/sales", label: "Sale" },
] as const;

const NAV_LINKS: { href: string; label: string; shop?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Shop", shop: true },
  { href: "/#brands", label: "Brands" },
  { href: "/new-arrival", label: "New Arrivals" },
  { href: "/sales", label: "Sale" },
  { href: "/contact-us#about", label: "About Us" },
  { href: "/contact-us", label: "Contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const [accountHref, setAccountHref] = useState("/login");
  const [accountLabel, setAccountLabel] = useState("Account");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  function openShop() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setShopOpen(true);
  }

  function scheduleCloseShop() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setShopOpen(false), 120);
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAccountHref("/login");
      setAccountLabel("Account");
      return;
    }
    getMe(token)
      .then(() => {
        setAccountHref("/account");
        setAccountLabel("My Account");
      })
      .catch(() => {
        setAccountHref("/login");
        setAccountLabel("Account");
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!shopOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!shopRef.current?.contains(event.target as Node)) setShopOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShopOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [shopOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        <div
          className={`bg-[var(--sp-maroon)] text-white transition-all duration-300 ${
            scrolled ? "pointer-events-none max-h-0 overflow-hidden opacity-0" : "max-h-12 opacity-100"
          }`}
        >
          <div className="sp-container relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-hidden px-4 py-2 text-[11px] font-medium tracking-[0.08em] sm:tracking-[0.12em]">
            <span className="hidden sm:block" aria-hidden />
            <p className="col-start-2 justify-self-center truncate text-center uppercase">
              Branded Fashion at Better Prices
            </p>
            <div className="col-start-3 flex min-w-0 items-center justify-end gap-2 sm:gap-3">
              <a
                href={whatsappHref("Hi Sab Pehno, I need help.")}
                target="_blank"
                rel="noreferrer"
                className="truncate transition hover:text-white/85"
              >
                {WHATSAPP_DISPLAY}
              </a>
              <span className="text-white/50" aria-hidden>
                |
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="truncate transition hover:text-white/85"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div
          className={`border-b transition-all duration-300 ${
            scrolled || menuOpen
              ? "border-[#eadfd4]/80 bg-[#f7f1ea]/80 shadow-[0_10px_30px_rgba(90,40,50,0.1)] backdrop-blur-xl"
              : "border-[#eadfd4]/40 bg-[#f7f1ea]/55 backdrop-blur-md"
          }`}
        >
          <div className="sp-container grid h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-4 sm:h-[4.75rem]">
            <a href="/" aria-label="Sab Pehno home" className="relative block h-12 w-36 shrink-0 sm:h-14 sm:w-44">
              <Image
                src="/logo-maroon.png"
                alt="Sab Pehno"
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left"
                quality={100}
              />
            </a>

            <nav className="hidden items-center justify-center gap-7 lg:flex">
              {NAV_LINKS.map((link) =>
                link.shop ? (
                  <div
                    key={link.label}
                    ref={shopRef}
                    className="relative"
                    onMouseEnter={openShop}
                    onMouseLeave={scheduleCloseShop}
                  >
                    <button
                      type="button"
                      aria-expanded={shopOpen}
                      aria-haspopup="menu"
                      onClick={() => setShopOpen((open) => !open)}
                      className="sp-nav-link"
                    >
                      <SpBtnText>
                        {link.label}
                        <span className="ml-1 text-[10px]">▾</span>
                      </SpBtnText>
                    </button>
                    <div
                      className={`absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 pt-3 transition ${
                        shopOpen
                          ? "pointer-events-auto visible opacity-100"
                          : "pointer-events-none invisible opacity-0"
                      }`}
                    >
                      <div
                        role="menu"
                        className="overflow-hidden rounded-2xl border border-[#ead9cb] bg-[#fffaf6] py-2 shadow-[0_18px_40px_rgba(90,40,50,0.14)]"
                        onMouseEnter={openShop}
                        onMouseLeave={scheduleCloseShop}
                      >
                        {SHOP_LINKS.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className="sp-nav-link !flex w-full justify-start px-4 py-2.5 text-sm hover:bg-[#f3e7dc]"
                            onClick={() => setShopOpen(false)}
                          >
                            <SpBtnText>{item.label}</SpBtnText>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`sp-nav-link ${link.href === "/" ? "is-active" : ""}`}
                  >
                    <SpBtnText>{link.label}</SpBtnText>
                  </a>
                ),
              )}
              <a href={accountHref} className="sp-nav-link">
                <SpBtnText>{accountLabel}</SpBtnText>
              </a>
            </nav>

            <div className="flex items-center justify-self-end gap-3 sm:gap-4">
              <a href="/collections" aria-label="Search products" className="text-[var(--sp-ink)] hover:text-[var(--sp-maroon)]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />
                </svg>
              </a>
              <a href={accountHref} aria-label={accountLabel} className="relative text-[var(--sp-ink)] hover:text-[var(--sp-maroon)]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 20a8 8 0 0 1 16 0"
                  />
                </svg>
              </a>
              <a
                href="/cart"
                aria-label={`Shopping bag${count ? `, ${count} items` : ""}`}
                className="relative text-[var(--sp-ink)] hover:text-[var(--sp-maroon)]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 8h12l-1 12H7L6 8Zm3-3a3 3 0 0 1 6 0" />
                </svg>
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--sp-maroon)] px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </a>
              <button
                type="button"
                className="text-[var(--sp-ink)] lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeWidth={1.8} d="M6 6l12 12M18 6 6 18" />
                  ) : (
                    <path strokeLinecap="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="border-t border-[var(--sp-gold)]/20 bg-[#f7f1ea]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) =>
                  link.shop ? (
                    <div key={link.label} className="border-b border-[#ead9cb]/70 pb-2">
                      <button
                        type="button"
                        aria-expanded={mobileShopOpen}
                        onClick={() => setMobileShopOpen((open) => !open)}
                        className="flex w-full items-center justify-between py-2 text-sm font-medium text-[var(--sp-ink)]"
                      >
                        Shop
                        <span className="text-[10px]">{mobileShopOpen ? "▴" : "▾"}</span>
                      </button>
                      {mobileShopOpen ? (
                        <div className="mb-1 flex flex-col gap-1 pl-3">
                          {SHOP_LINKS.map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className="py-1.5 text-sm text-[var(--sp-ink)]/80"
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="py-2 text-sm font-medium text-[var(--sp-ink)]"
                    >
                      {link.label}
                    </a>
                  ),
                )}
                <a
                  href={accountHref}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-medium text-[var(--sp-ink)]"
                >
                  {accountLabel}
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Spacer so content starts below fixed navbar */}
      <div
        aria-hidden
        className={`shrink-0 transition-[height] duration-300 ${
          scrolled ? "h-[4.25rem] sm:h-[4.75rem]" : "h-[calc(4.25rem+2.25rem)] sm:h-[calc(4.75rem+2.25rem)]"
        }`}
      />
    </>
  );
}
