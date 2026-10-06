import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function Page({ searchParams }: { searchParams: CatalogSearchParams }) {
  return <CatalogPage title="Collections" eyebrow="Find your next dress"
    copy="Explore everyday dresses, evening looks, summer florals, and premium occasionwear." path="/collections"
    filters={{}} searchParams={searchParams} />;
}
