import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import Collection from "@/components/Collection";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Fixed Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Shop What's New */}
      <Shop />

      {/* 4. Men/Women & Brand Banner */}
      <Collection />

      {/* 5. Most Worn, Values & Community */}
      <Showcase />

      {/* 6. Newsletter & Footer */}
      <Footer />
    </main>
  );
}