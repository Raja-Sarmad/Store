import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import Collection from "@/components/Collection";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/api";

export default async function Home() {
  const products = await getProducts("inStock=true&limit=100&sort=-totalSold,position,-createdAt").catch(() => null);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Fixed Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Brand slider and popular dresses */}
      <Shop products={products ?? []} unavailable={products === null} />

      {/* 4. Men/Women & Brand Banner */}
      <Collection />

      {/* 5. Most Worn, Values & Community */}
      <Showcase />

      {/* 6. Newsletter & Footer */}
      <Footer />
    </main>
  );
}
