import CatalogPage from "@/components/CatalogPage";
import type { CatalogSearchParams } from "@/lib/catalog";

export default function Page({ searchParams }: { searchParams: CatalogSearchParams }) {
  return <CatalogPage title="Sales" eyebrow="Limited markdowns"
    copy="Your favourite dresses at reduced prices, while sizes last." path="/sales"
    filters={{ onSale: "true" }} searchParams={searchParams} />;
}
