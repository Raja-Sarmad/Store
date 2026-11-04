export default function HomeDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute left-0 top-[62%] h-[520px] w-full" viewBox="0 0 1440 520" preserveAspectRatio="none">
        <defs>
          <linearGradient id="silkA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff7f1" />
            <stop offset="45%" stopColor="#f6dccb" />
            <stop offset="100%" stopColor="#f3cbb8" />
          </linearGradient>
          <linearGradient id="silkB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="55%" stopColor="#f8e6d8" />
            <stop offset="100%" stopColor="#efd0be" />
          </linearGradient>
        </defs>
        <path d="M-40 90c220 120 380-30 640 20 250 48 390 110 760 30 40-8 70-6 90 8v420H-40Z" fill="url(#silkA)" />
        <path d="M-20 210c260 90 420-40 700 10 240 42 420-10 760 50v280H-20Z" fill="url(#silkB)" opacity="0.95" />
        <path d="M0 150c180 70 340-20 560 16 220 36 400 8 620-10" fill="none" stroke="#e7c7b0" strokeWidth="1.4" />
        <path d="M80 250c200 60 360-16 560 20" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
      </svg>

      <svg className="absolute right-[-40px] top-[58%] w-[280px] text-[#d7b48a]" viewBox="0 0 200 180" fill="none" opacity="0.7">
        <path d="M150 20c-8 40-2 70 22 110" stroke="currentColor" strokeWidth="1.2" />
        <path d="M118 58c24 10 36 28 42 58" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="128" cy="40" r="10" stroke="currentColor" />
        <path d="M150 48c8 2 14 8 16 16" stroke="currentColor" />
      </svg>
      <svg className="absolute left-[-20px] top-[78%] w-[240px] text-[#d7b48a]" viewBox="0 0 200 160" fill="none" opacity="0.65">
        <path d="M24 130c28-48 52-36 64-88 10 34 30 50 62 56" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="90" cy="34" r="8" stroke="currentColor" />
      </svg>

      <span className="absolute left-[8%] top-[68%] h-3 w-5 rotate-[-28deg] rounded-full bg-[#c45b78]/50" />
      <span className="absolute right-[18%] top-[64%] h-2.5 w-4 rotate-12 rounded-full bg-[#a33b5c]/40" />
      <span className="absolute right-[8%] top-[74%] h-3 w-5 rotate-45 rounded-full bg-[#d4a0ae]/70" />
    </div>
  );
}
