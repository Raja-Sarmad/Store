import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function Page({ searchParams }: { searchParams: CatalogSearchParams }) {
  return <CatalogPage title="New Arrival" eyebrow="Just added"
    copy="Fresh dresses from our latest arrivals, with the newest additions first." path="/new-arrival"
    filters={{ new: "true" }} searchParams={searchParams} />;
}
