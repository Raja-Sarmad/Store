import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  imagePosition?: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10">
      <div className="sp-container">
        <div
          className="relative overflow-hidden rounded-[1.5rem] px-5 py-8 text-white shadow-[0_18px_40px_rgba(60,10,25,0.2)] sm:rounded-[2rem] sm:px-10 sm:py-10"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(55,10,22,0.88) 0%, rgba(74,14,28,0.78) 48%, rgba(90,22,40,0.72) 100%), url(/promo-silk-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#e8d0a8_0%,transparent_70%)] opacity-25 blur-2xl"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
            {eyebrow}
          </p>
          <h1 className="mt-2 max-w-3xl font-serif text-[2rem] font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-[15px]">
              {description}
            </p>
          ) : null}
          {children ? <div className="relative z-10 mt-6 w-full">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
