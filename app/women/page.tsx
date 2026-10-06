import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function WomenPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  return (
    <CatalogPage
      title="Shop Women"
      eyebrow="Women's collection"
      copy="Explore women's clothing, with filters for brand, size, colour, price, availability, and more."
      path="/women"
      filters={{ gender: "women" }}
      searchParams={searchParams}
    />
  );
}
