import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function MenPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  return (
    <CatalogPage
      title="Shop Men"
      eyebrow="Men's collection"
      copy="Explore men's clothing, with filters for brand, size, colour, price, availability, and more."
      path="/men"
      filters={{ gender: "men" }}
      searchParams={searchParams}
    />
  );
}
