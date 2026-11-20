import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function Page({ searchParams }: { searchParams: CatalogSearchParams }) {
  return (
    <CatalogPage
      title="Shop All"
      eyebrow="Full catalog"
      copy="Browse every Sab Pehno piece — men's, women's, and unisex — in one place."
      path="/collections"
      filters={{}}
      searchParams={searchParams}
    />
  );
}
