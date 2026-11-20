import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function WomenPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  return (
    <CatalogPage
      title="Women's Collection"
      eyebrow="Women only"
      copy="Dresses, festive wear, and everyday looks for women — men's styles stay on the men's page."
      path="/women"
      filters={{ gender: "women" }}
      searchParams={searchParams}
    />
  );
}
