import type { Metadata } from "next";
import StoreShell from "@/components/StoreShell";
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
      <StoreShell>
        <section className="sp-container flex max-w-3xl flex-col items-start gap-5 px-4 py-16 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--sp-muted)]">404</p>
          <h1 className="font-serif text-4xl font-medium text-[var(--sp-maroon-deep)] sm:text-5xl">
            Product not found.
          </h1>
          <p className="max-w-lg text-sm text-[var(--sp-muted)]">
            This piece may be offline or the link is outdated. Browse the full collection instead.
          </p>
          <a href="/collections" className="sp-btn">
            Back to collections
          </a>
        </section>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <ProductDetail product={product} />
    </StoreShell>
  );
}
