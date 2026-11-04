"use client";

import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { cartItemKey, useCart } from "@/components/CartProvider";
import { productHref } from "@/lib/api";
import { formatPrice } from "@/lib/money";

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, removeItem } = useCart();
  return (
    <StoreShell>
      <PageHero
        eyebrow="Your selections"
        title="Shopping bag"
        description="Review your pieces and get them on the way."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          {!ready ? (
            <p className="py-12 text-sm text-[var(--sp-muted)]">Loading your bag…</p>
          ) : !items.length ? (
            <div className="sp-panel px-6 py-14 text-center sm:px-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--sp-muted)]">
                Your bag is waiting
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--sp-maroon-deep)]">
                Nothing in here yet.
              </h2>
              <a href="/collections" className="sp-btn mt-7">
                Explore the collection →
              </a>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
              <div className="sp-panel divide-y divide-[#ead9cb] overflow-hidden p-0">
                {items.map((item) => {
                  const key = cartItemKey(item);
                  return (
                    <article
                      key={key}
                      className="grid grid-cols-[84px_1fr] gap-3 p-4 sm:grid-cols-[112px_1fr_auto] sm:gap-5 sm:p-5"
                    >
                      <img
                        src={item.product.images?.[0] || "/hero-sabpehno.jpg"}
                        alt={item.product.name}
                        className="aspect-[3/4] w-full rounded-xl bg-[#f0e4d8] object-cover"
                      />
                      <div className="flex min-w-0 flex-col justify-between py-0.5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--sp-muted)]">
                            {item.product.brand || "Sab Pehno"}
                          </p>
                          <h2 className="mt-1 font-serif text-base font-medium leading-snug">
                            <a href={productHref(item.product)} className="hover:text-[var(--sp-maroon)]">
                              {item.product.name}
                            </a>
                          </h2>
                          {(item.size || item.color) && (
                            <p className="mt-1.5 text-xs text-[var(--sp-muted)]">
                              {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex h-9 items-center rounded-full border border-[#e6d8cc] bg-[#fbf6f0]">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => setQuantity(key, item.quantity - 1)}
                              className="h-full px-3 text-[var(--sp-muted)] hover:text-[var(--sp-maroon)]"
                            >
                              −
                            </button>
                            <span className="min-w-7 text-center text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => setQuantity(key, item.quantity + 1)}
                              className="h-full px-3 text-[var(--sp-muted)] hover:text-[var(--sp-maroon)]"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(key)}
                            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--sp-muted)] underline underline-offset-4 hover:text-[var(--sp-maroon)]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="col-start-2 row-start-2 self-start text-right text-sm font-medium sm:col-start-3 sm:row-start-1">
                        {formatPrice(Number(item.product.price) * item.quantity)}
                      </p>
                    </article>
                  );
                })}
              </div>

              <aside className="sp-panel h-fit p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                  Order summary
                </p>
                <div className="mt-5 flex justify-between border-b border-[#ead9cb] pb-4 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-[var(--sp-muted)]">
                  Delivery charges and final total are calculated securely at checkout.
                </p>
                <a href="/checkout" className="sp-btn mt-6 h-12 w-full justify-center py-0">
                  Continue to checkout →
                </a>
                <a
                  href="/collections"
                  className="mt-4 block text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--sp-maroon)] underline underline-offset-4"
                >
                  Keep shopping
                </a>
              </aside>
            </div>
          )}
        </div>
      </section>
    </StoreShell>
  );
}
