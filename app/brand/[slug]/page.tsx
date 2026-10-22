import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import { getBrandBySlug, STORE_BRANDS } from "@/lib/brands";
import type { CatalogSearchParams } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: CatalogSearchParams;
};

export function generateStaticParams() {
  return STORE_BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand not found · Sab Pehno" };
  return {
    title: `${brand.name} · Sab Pehno`,
    description: `Shop ${brand.name} products at Sab Pehno.`,
  };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  return (
    <CatalogPage
      title={brand.name}
      eyebrow="Brand collection"
      copy={`Only ${brand.name} products. Switch brands from the strip above or the Brand page filter below.`}
      path={`/brand/${brand.slug}`}
      searchParams={searchParams}
      lockedBrand={brand}
    />
  );
}
