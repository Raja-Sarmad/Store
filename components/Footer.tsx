"use client";

import Image from "next/image";

const CENTER_LINKS = [
  { href: "/collections", label: "Shop" },
  { href: "/#brands", label: "Brands" },
  { href: "/contact-us#about", label: "About Us" },
  { href: "/contact-us", label: "Contact" },
];

const POLICY_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/delivery", label: "Shipping Policy" },
  { href: "/returns", label: "Return Policy" },
  { href: "/privacy", label: "Privacy Policy" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "Instagram", href: "https://instagram.com", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" },
  { label: "TikTok", href: "https://tiktok.com", path: "M19 8.2a6.4 6.4 0 0 1-4-1.4v7.1a5.3 5.3 0 1 1-4.6-5.25v2.2a3.1 3.1 0 1 0 2.1 2.95V2h2.1A4.4 4.4 0 0 0 19 5.8V8.2z" },
  { label: "YouTube", href: "https://youtube.com", path: "M22.5 7.2a3 3 0 0 0-2.1-2.1C18.5 4.6 12 4.6 12 4.6s-6.5 0-8.4.5A3 3 0 0 0 1.5 7.2 31 31 0 0 0 1 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-4.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z" },
  { label: "Pinterest", href: "https://pinterest.com", path: "M12 2a10 10 0 0 0-3.5 19.4c-.05-.9-.1-2.3.02-3.3.11-.9.73-3.05.73-3.05s-.19-.37-.19-.92c0-.86.5-1.5 1.12-1.5.53 0 .78.4.78.87 0 .53-.34 1.33-.51 2.07-.15.62.3 1.12.9 1.12 1.08 0 1.91-1.14 1.91-2.78 0-1.45-.98-2.54-2.76-2.54-2.01 0-3.26 1.5-3.26 3.18 0 .63.24 1.3.54 1.67.06.07.07.13.05.2l-.2.84c-.03.13-.11.16-.25.1-1-.47-1.62-1.93-1.62-3.11 0-2.53 1.84-4.86 5.3-4.86 2.78 0 4.94 1.98 4.94 4.63 0 2.76-1.74 4.98-4.16 4.98-.81 0-1.58-.42-1.84-.92l-.5 1.91c-.18.7-.67 1.58-1 2.12A10 10 0 1 0 12 2Z" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-transparent pb-6 pt-3 text-[#3b241f] sm:pt-4">
      <svg className="pointer-events-none absolute left-2 top-16 h-40 w-32 text-[#c4a484]/70 sm:left-8" viewBox="0 0 120 160" fill="none" aria-hidden>
        <path d="M28 148c18-40 34-34 40-90 10 30 28 48 52 56" stroke="currentColor" strokeWidth="1.2" />
        <path d="M48 148c8-24 18-42 12-72" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="70" cy="42" r="9" stroke="currentColor" />
        <path d="M86 52c10 2 16 10 18 18" stroke="currentColor" />
      </svg>
      <span aria-hidden className="pointer-events-none absolute right-[12%] top-24 h-3 w-5 rotate-12 rounded-full bg-[#c45b78]/45 blur-[0.5px]" />
      <span aria-hidden className="pointer-events-none absolute right-[8%] top-40 h-2.5 w-4 -rotate-12 rounded-full bg-[#a33b5c]/35" />
      <span aria-hidden className="pointer-events-none absolute right-[18%] bottom-24 h-3 w-5 rotate-45 rounded-full bg-[#d4a0ae]/55" />

      <div className="sp-container relative z-10">
        <div className="rounded-[2rem] border border-[#eadfd4]/90 bg-[#fbf6f0]/75 px-5 py-5 shadow-[0_16px_40px_rgba(90,40,50,0.08)] backdrop-blur-md sm:px-7 lg:rounded-full lg:py-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex min-w-0 shrink-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#5c1a30]/80 bg-transparent text-[#5c1a30]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7.5h16v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9Zm0 0 8 5.5L20 7.5" />
                </svg>
              </span>
              <div>
                <p className="font-serif text-[1.65rem] font-semibold leading-none text-[#3b141f] sm:text-2xl">
                  Stay Updated
                </p>
                <p className="mt-1 text-sm text-[#7a6560]">Get the latest collections and offers.</p>
              </div>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full min-w-0 flex-1 flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="h-11 min-w-0 flex-1 rounded-full border border-[#e6d8cc] bg-[#f3ece5] px-5 text-sm text-[#3b241f] outline-none placeholder:text-[#9a857a] focus:border-[#c4a484] focus:bg-white"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-[#5c1a30] px-7 text-sm font-semibold text-white transition hover:bg-[#3f101f]"
              >
                Subscribe
              </button>
            </form>

            <div className="flex shrink-0 items-center gap-2.5 lg:pl-1">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#1a1a1a] text-white transition hover:bg-[#5c1a30]"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 px-6 py-8 shadow-[0_18px_40px_rgba(90,40,50,0.07)] backdrop-blur-md sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <a href="/" className="shrink-0">
              <span className="relative block h-14 w-40">
                <Image
                  src="/logo-maroon.png"
                  alt="Sab Pehno"
                  fill
                  sizes="160px"
                  quality={100}
                  className="object-contain object-left"
                />
              </span>
              <p className="mt-1 text-xs text-[#7a6560]">Branded Fashion. For Everyone.</p>
            </a>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-[#3b241f]">
              {CENTER_LINKS.map((link, index) => (
                <span key={link.label} className="inline-flex items-center gap-5">
                  {index > 0 ? <span className="hidden text-[#d2bfb2] sm:inline" aria-hidden>|</span> : null}
                  <a href={link.href} className="hover:text-[#5c1a30]">
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#7a6560]">
              {POLICY_LINKS.map((link, index) => (
                <span key={link.label} className="inline-flex items-center gap-5">
                  {index > 0 ? <span className="hidden text-[#d2bfb2] sm:inline" aria-hidden>|</span> : null}
                  <a href={link.href} className="hover:text-[#5c1a30]">
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>
          </div>

          <div className="relative mt-8 border-t border-[#ead9cb]/80 pt-5 text-center">
            <p className="text-xs text-[#8a7368]">© 2026 Sabpehno. All rights reserved.</p>
            <button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="absolute right-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#5c1a30] text-white shadow-md transition hover:bg-[#3f101f]"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
