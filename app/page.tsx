import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import HomeValues from "@/components/home/HomeValues";
import HomeCategories from "@/components/home/HomeCategories";
import HomeBrands from "@/components/home/HomeBrands";
import HomeBestsellers from "@/components/home/HomeBestsellers";
import HomePromo from "@/components/home/HomePromo";
import WinterSnow from "@/components/home/WinterSnow";
import { getProducts, type Product } from "@/lib/api";

const BLEND = "#f7eee6";

export default async function Home() {
  const [catalog, topSelling] = await Promise.all([
    getProducts("inStock=true&limit=100&sort=-totalSold,position,-createdAt").catch(() => [] as Product[]),
    getProducts("bestSeller=true&inStock=true&limit=5&sort=-totalSold,-createdAt").catch(() => [] as Product[]),
  ]);
  const list = Array.isArray(catalog) ? catalog : [];
  const bestsellers = (Array.isArray(topSelling) ? topSelling : []).slice(0, 5);

  return (
    <main
      className="relative min-h-screen overflow-x-clip text-[var(--sp-ink)] selection:bg-[var(--sp-maroon)] selection:text-white"
      style={{ backgroundColor: BLEND }}
    >
      {/* One silk from hero through footer — balanced wash */}
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
          background: `linear-gradient(180deg, rgba(247,238,230,0.55) 0%, rgba(247,238,230,0.38) 18%, rgba(247,238,230,0.32) 70%, rgba(247,238,230,0.48) 100%)`,
        }}
      />

      <WinterSnow />

      <div className="relative z-10">
        <Navbar />
        <HomeHero />
        <HomeValues />
        <HomeCategories />
        <HomeBrands />
        <HomeBestsellers products={bestsellers.length ? bestsellers : list.slice(0, 5)} />
        <HomePromo />
        <Footer />
      </div>
    </main>
  );
}
