import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function Page({ searchParams }: { searchParams: CatalogSearchParams }) {
  return <CatalogPage title="Premium" eyebrow="Premium edits"
    copy="Occasion dresses with refined fabrics, embroidery, and special finishes." path="/premium"
    filters={{ tags: "Premium" }} searchParams={searchParams} />;
}
