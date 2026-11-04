import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BLEND = "#f7eee6";

export default function StoreShell({
  children,
  withFooter = true,
}: {
  children: ReactNode;
  withFooter?: boolean;
}) {
  return (
    <main
      className="relative min-h-screen overflow-x-clip text-[var(--sp-ink)] selection:bg-[var(--sp-maroon)] selection:text-white"
      style={{ backgroundColor: BLEND }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundImage: "url(/midpage-silk.jpg)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(247,238,230,0.55) 0%, rgba(247,238,230,0.38) 18%, rgba(247,238,230,0.32) 70%, rgba(247,238,230,0.48) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        {withFooter ? <Footer /> : null}
      </div>
    </main>
  );
}
