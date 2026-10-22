import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { getProductBySlug, type Product } from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function loadProduct(slug: string): Promise<Product | null> {
  try {
    return await getProductBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) {
    return { title: "Product not found · Sab Pehno" };
  }
  const description =
    product.description?.trim().slice(0, 160) ||
    `${product.name}${product.brand ? ` by ${product.brand}` : ""} — Sab Pehno`;
  return {
    title: `${product.name} · Sab Pehno`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await loadProduct(decodeURIComponent(slug));

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <section className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 pb-24 pt-32 sm:px-12">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">404</p>
          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Product not found.
          </h1>
          <p className="max-w-lg text-sm text-zinc-400">
            This piece may be offline or the link is outdated. Browse the full collection instead.
          </p>
          <a
            href="/collections"
            className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-zinc-200"
          >
            Back to collections
          </a>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />
      <div className="h-20" aria-hidden />
      <nav
        aria-label="Breadcrumb"
        className="border-b border-zinc-200 bg-white px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 sm:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <a href="/" className="hover:text-black">
            Home
          </a>
          <span aria-hidden>/</span>
          <a href="/collections" className="hover:text-black">
            Collections
          </a>
          {product.category && (
            <>
              <span aria-hidden>/</span>
              <a
                href={
                  product.categorySlug
                    ? `/collections?category=${encodeURIComponent(product.categorySlug)}`
                    : "/collections"
                }
                className="hover:text-black"
              >
                {product.category}
              </a>
            </>
          )}
          <span aria-hidden>/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </nav>
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
