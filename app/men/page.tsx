import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function MenPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  return (
    <CatalogPage
      title="Men's Collection"
      eyebrow="Men only"
      copy="Shop pieces curated for men only — women's styles stay on the women's page."
      path="/men"
      filters={{ gender: "men" }}
      searchParams={searchParams}
    />
  );
}
