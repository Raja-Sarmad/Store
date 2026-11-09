"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { getMyOrderByNumber, getToken, type StoreOrder } from "@/lib/api";
import { formatPrice } from "@/lib/money";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ number: string }>();
  const number = decodeURIComponent(String(params?.number || ""));
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(`/orders/${number}`)}`);
      return;
    }
    if (!number) {
      setError("Order not found.");
      setLoading(false);
      return;
    }
    getMyOrderByNumber(number, token)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this order"))
      .finally(() => setLoading(false));
  }, [number, router]);

  const address = order?.shippingAddress;

  return (
    <StoreShell>
      <PageHero
        eyebrow="Order details"
        title={order ? `Order #${order.number}` : "Order"}
        description="See what you ordered, where it’s going, and the current status."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          {loading ? (
            <p className="py-10 text-sm text-[var(--sp-muted)]">Loading order…</p>
          ) : error ? (
            <div className="sp-panel p-6">
              <p className="text-sm text-red-800">{error}</p>
              <a href="/orders" className="sp-btn mt-5 inline-flex">
                Back to orders
              </a>
            </div>
          ) : order ? (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="sp-panel overflow-hidden p-0">
                <div className="border-b border-[#ead9cb] px-5 py-4 sm:px-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                    Items
                  </p>
                </div>
                <div className="divide-y divide-[#ead9cb]">
                  {order.items?.map((item, index) => (
                    <article
                      key={`${item.productId}-${index}`}
                      className="grid grid-cols-[72px_1fr_auto] gap-3 px-5 py-4 sm:grid-cols-[88px_1fr_auto] sm:gap-4 sm:px-6"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#f0e4d8]">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-medium leading-snug text-[var(--sp-ink)]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--sp-muted)]">
                          {[
                            item.size ? `Size: ${item.size}` : null,
                            item.color ? `Color: ${item.color}` : null,
                            `Qty: ${item.quantity}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="mt-2 text-sm text-[var(--sp-muted)]">{formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatPrice(Number(item.price) * Number(item.quantity || 0))}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="space-y-4">
                <div className="sp-panel p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                    Summary
                  </p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--sp-muted)]">Status</dt>
                      <dd className="capitalize font-medium">{order.status?.replace(/_/g, " ")}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--sp-muted)]">Payment</dt>
                      <dd className="capitalize">
                        {(order.paymentMethod || order.payment?.method || "cod").replace(/_/g, " ")}
                        {order.payment?.status ? ` · ${order.payment.status}` : ""}
                      </dd>
                    </div>
                    {order.createdAt ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--sp-muted)]">Placed</dt>
                        <dd>
                          {new Date(order.createdAt).toLocaleString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-4 border-t border-[#ead9cb] pt-3">
                      <dt className="text-[var(--sp-muted)]">Subtotal</dt>
                      <dd>{formatPrice(Number(order.subtotal ?? order.total) || 0)}</dd>
                    </div>
                    {Number(order.shipping) > 0 ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--sp-muted)]">Shipping</dt>
                        <dd>{formatPrice(Number(order.shipping) || 0)}</dd>
                      </div>
                    ) : null}
                    {Number(order.discount) > 0 ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--sp-muted)]">Discount</dt>
                        <dd>-{formatPrice(Number(order.discount) || 0)}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-4 border-t border-[#ead9cb] pt-3 text-base font-semibold">
                      <dt>Total</dt>
                      <dd>{formatPrice(Number(order.total) || 0)}</dd>
                    </div>
                  </dl>
                </div>

                {address ? (
                  <div className="sp-panel p-5 sm:p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                      Delivery address
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--sp-ink)]">
                      {[address.firstName, address.lastName].filter(Boolean).join(" ")}
                      <br />
                      {address.address}
                      <br />
                      {[address.city, address.state, address.zip].filter(Boolean).join(", ")}
                      <br />
                      {address.country}
                      {address.phone ? (
                        <>
                          <br />
                          {address.phone}
                        </>
                      ) : null}
                    </p>
                  </div>
                ) : null}

                {order.timeline?.length ? (
                  <div className="sp-panel p-5 sm:p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                      Timeline
                    </p>
                    <ul className="mt-4 space-y-3">
                      {order.timeline.map((event, index) => (
                        <li key={`${event.status}-${index}`} className="text-sm">
                          <p className="capitalize font-medium">{event.status?.replace(/_/g, " ")}</p>
                          <p className="text-xs text-[var(--sp-muted)]">
                            {event.date
                              ? new Date(event.date).toLocaleString("en-PK", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                            {event.note ? ` · ${event.note}` : ""}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <a href="/orders" className="sp-btn-outline inline-flex justify-center">
                  ← All orders
                </a>
              </aside>
            </div>
          ) : null}
        </div>
      </section>
    </StoreShell>
  );
}
