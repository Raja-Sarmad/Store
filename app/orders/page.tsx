"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { getMyOrders, getToken, type StoreOrder } from "@/lib/api";
import { formatPrice } from "@/lib/money";

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<StoreOrder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login?next=/orders");
      return;
    }
    getMyOrders(token)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => {
        setOrders([]);
        setError(err instanceof Error ? err.message : "Could not load orders");
      });
  }, [router]);

  return (
    <StoreShell>
      <PageHero
        eyebrow="Your purchases"
        title="My orders"
        description="Track every order you place — items, totals, and delivery status in one place."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          {error ? (
            <p role="alert" className="sp-panel mb-6 p-4 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          {orders === null ? (
            <p className="py-10 text-sm text-[var(--sp-muted)]">Loading your orders…</p>
          ) : !orders.length ? (
            <div className="sp-panel px-6 py-14 text-center">
              <h2 className="font-serif text-3xl font-medium text-[var(--sp-maroon-deep)]">No orders yet</h2>
              <p className="mt-3 text-sm text-[var(--sp-muted)]">When you place an order, it will show up here.</p>
              <a href="/collections" className="sp-btn mt-7 inline-flex">
                Start shopping →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                return (
                  <article key={order._id || order.number} className="sp-panel overflow-hidden p-0">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                          Order
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-medium text-[var(--sp-maroon-deep)]">
                          #{order.number}
                        </h2>
                        <p className="mt-2 text-sm text-[var(--sp-muted)]">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-PK", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                          {" · "}
                          {itemCount} item{itemCount === 1 ? "" : "s"}
                          {" · "}
                          <span className="capitalize">{statusLabel(order.status || "pending")}</span>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <p className="text-base font-semibold text-[var(--sp-ink)]">
                          {formatPrice(Number(order.total) || 0)}
                        </p>
                        <a href={`/orders/${encodeURIComponent(order.number)}`} className="sp-btn h-10 px-5 py-0">
                          View order
                        </a>
                      </div>
                    </div>
                    {order.items?.length ? (
                      <div className="flex gap-2 overflow-x-auto border-t border-[#ead9cb] bg-[#fffaf6]/70 px-5 py-3 sm:px-6">
                        {order.items.slice(0, 6).map((item, index) => (
                          <div
                            key={`${order.number}-${item.productId}-${index}`}
                            className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f0e4d8]"
                          >
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-8 text-sm text-[var(--sp-muted)]">
            <a href="/account" className="font-semibold text-[var(--sp-maroon)] underline underline-offset-4">
              Back to account
            </a>
          </p>
        </div>
      </section>
    </StoreShell>
  );
}
