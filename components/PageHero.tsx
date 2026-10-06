import Image from "next/image";
import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  imagePosition = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  imagePosition?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[520px] overflow-hidden border-b border-zinc-800 bg-zinc-950 pt-28 pb-12 text-white sm:min-h-[620px] sm:pb-16 lg:min-h-[680px]">
      <Image
        src="/hero image.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/75 to-black/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/50 via-transparent to-black/15" />
      <div className="pointer-events-none absolute right-[-4rem] top-16 hidden select-none font-black leading-none tracking-[-0.12em] text-white/[0.045] lg:block lg:text-[22rem]">
        O
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between px-6 pb-8 pt-36 sm:px-12 sm:pb-12 sm:pt-40">
        <div className="self-start text-left">
          <div className="mb-4 flex items-center justify-start gap-3 text-[10px] font-mono uppercase tracking-[0.32em] text-zinc-300 sm:text-xs">
            <span className="h-px w-8 bg-white" />
            <span>{eyebrow}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              {title}
            </h1>
            {description && <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">{description}</p>}
          </div>
        </div>
        {children ? <div className="relative z-10 mt-12 w-full">{children}</div> : (
          <div className="hidden self-start border-l border-white/30 pl-5 font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-zinc-400 lg:block">
            Overdose<br />Everyday essentials
          </div>
        )}
      </div>
    </section>
  );
}
