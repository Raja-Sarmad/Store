import Image from "next/image";
import Link from "next/link";

export default function HomePromo() {
  return (
    <section className="bg-transparent px-4 pb-3 pt-6 sm:px-6 sm:pb-4 sm:pt-8">
      <div className="sp-container">
        <div
          className="relative isolate overflow-hidden rounded-[1.75rem] text-white shadow-[0_22px_48px_rgba(60,10,25,0.28)] sm:rounded-[2.5rem]"
          style={{
            backgroundImage:
              "linear-gradient(100deg, rgba(55,10,22,0.55) 0%, rgba(74,14,28,0.35) 45%, rgba(90,22,40,0.4) 100%), url(/promo-silk-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Left lily */}
          <div className="pointer-events-none absolute -bottom-8 -left-10 top-[-18%] w-[46%] max-w-[300px] sm:-left-6 sm:w-[34%] lg:max-w-[320px] lg:w-[30%]">
            <Image
              src="/promo-lily.jpg"
              alt=""
              fill
              sizes="320px"
              className="object-cover object-[35%_45%] [mask-image:linear-gradient(90deg,#000_0%,#000_55%,transparent_100%)]"
              aria-hidden
            />
          </div>

          {/* Right gold flower */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-2 top-1/2 h-36 w-28 -translate-y-1/2 opacity-90 sm:right-1 sm:h-44 sm:w-36 lg:right-3 lg:h-48 lg:w-40"
          >
            <Image
              src="/promo-gold-flower.png"
              alt=""
              fill
              sizes="160px"
              className="object-contain object-center drop-shadow-[0_0_10px_rgba(232,208,168,0.25)]"
            />
          </div>

          <span aria-hidden className="pointer-events-none absolute left-[42%] top-4 h-2 w-3 rotate-12 rounded-full bg-[#f0b8c8]/75" />
          <span aria-hidden className="pointer-events-none absolute left-[48%] bottom-5 h-2.5 w-4 -rotate-12 rounded-full bg-[#d98aa0]/55" />
          <span aria-hidden className="pointer-events-none absolute right-[30%] top-3 h-10 w-10 rounded-full bg-white/20 blur-md" />

          <div className="relative z-10 flex flex-col gap-6 px-5 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10 lg:py-9 xl:px-12">
            <div className="max-w-sm pl-16 sm:pl-24 lg:pl-28 xl:pl-32">
              <h2 className="font-serif text-[1.85rem] font-medium leading-[1.1] tracking-tight sm:text-[2.35rem] lg:text-[2.6rem]">
                Exclusive Offers
              </h2>
              <p className="mt-1.5 text-[13px] leading-snug text-white/80 sm:text-[15px]">
                Get the best deals on your favorite brands.
              </p>
            </div>

            <div className="flex shrink-0 items-end gap-2.5 self-start pl-16 sm:pl-24 lg:self-center lg:pl-0">
              <div>
                <p className="font-serif text-[10px] uppercase tracking-[0.32em] text-white/85 sm:text-[11px]">
                  Up to
                </p>
                <p className="font-serif text-[3.25rem] font-semibold leading-none tracking-tight sm:text-[3.75rem] lg:text-[4.25rem]">
                  50%
                </p>
              </div>
              <p className="pb-1.5 font-serif text-[1.85rem] font-medium tracking-wide sm:pb-2 sm:text-[2.35rem] lg:text-[2.6rem]">
                OFF
              </p>
            </div>

            <div className="flex shrink-0 items-center pl-16 sm:pl-24 lg:pl-0 lg:pr-16">
              <Link
                href="/sales"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#fff8f0] px-7 text-sm font-semibold text-[#4a1424] shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition hover:bg-white sm:h-12 sm:px-8"
              >
                Shop Sale <span aria-hidden className="ml-1.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
