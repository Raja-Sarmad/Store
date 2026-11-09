"use client";

import { useEffect, useState, type FormEvent } from "react";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { useCart } from "@/components/CartProvider";
import { createOrder, getToken } from "@/lib/api";
import { formatPrice } from "@/lib/money";

const fields = [
  ["firstName", "First name", true],
  ["lastName", "Last name", true],
  ["phone", "Phone number", true],
  ["address", "Street address", true],
  ["city", "City", true],
  ["state", "State / province", true],
  ["zip", "Postal code", true],
  ["country", "Country", true],
] as const;

export default function CheckoutPage() {
  const { items, subtotal, clear, ready, syncStock } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express" | "nextday">("standard");

  useEffect(() => setAuthenticated(Boolean(getToken())), []);

  useEffect(() => {
    if (ready && items.length) void syncStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items.length]);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      window.location.href = "/login?next=/checkout";
      return;
    }
    if (!items.length) return;
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const shippingAddress = Object.fromEntries(
      fields.map(([name]) => [name, String(form.get(name) || "").trim()]),
    ) as Record<(typeof fields)[number][0], string>;
    try {
      const order = await createOrder(
        {
          items: items.map(({ product, quantity, size, color }) => ({
            productId: product._id,
            quantity,
            size,
            color,
          })),
          shippingAddress,
          paymentMethod: "cod",
          deliveryOption,
        },
        token,
      );
      setOrderNumber(order.number);
      clear();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StoreShell>
      <PageHero
        eyebrow="Almost yours"
        title="Checkout"
        description="Add your delivery details and choose how your order gets to you."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          {orderNumber ? (
            <div className="sp-panel mx-auto max-w-2xl px-6 py-12 text-center sm:px-10">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--sp-muted)]">
                Order confirmed
              </span>
              <h2 className="mt-4 font-serif text-3xl font-medium text-[var(--sp-maroon-deep)] sm:text-4xl">
                You&apos;re all set.
              </h2>
              <p className="mt-4 text-sm text-[var(--sp-muted)]">
                Your order <b>#{orderNumber}</b> has been placed with cash on delivery. Track it anytime from
                your account.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/orders" className="sp-btn">
                  View my orders
                </a>
                <a href="/collections" className="sp-btn-outline">
                  Keep shopping
                </a>
              </div>
            </div>
          ) : !ready ? (
            <p className="py-12 text-sm text-[var(--sp-muted)]">Loading your checkout…</p>
          ) : items.length === 0 ? (
            <div className="sp-panel py-14 text-center">
              <h2 className="font-serif text-3xl font-medium text-[var(--sp-maroon-deep)]">Your bag is empty.</h2>
              <a href="/collections" className="sp-btn mt-6 inline-flex">
                Shop collections
              </a>
            </div>
          ) : (
            <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="sp-panel p-5 sm:p-7">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                  01 / Delivery address
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {fields.map(([name, label, required]) => (
                    <label
                      key={name}
                      className={`sp-label ${name === "address" ? "sm:col-span-2" : ""}`}
                    >
                      {label}
                      <input
                        name={name}
                        required={required}
                        autoComplete={
                          name === "address"
                            ? "street-address"
                            : name === "firstName" || name === "lastName"
                              ? name
                              : name === "zip"
                                ? "postal-code"
                                : name === "phone"
                                  ? "tel"
                                  : "on"
                        }
                        className="sp-input font-normal normal-case tracking-normal"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                    02 / Delivery speed
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(
                      [
                        ["standard", "Standard", "Store rate"],
                        ["express", "Express", `+${formatPrice(12)}`],
                        ["nextday", "Next day", `+${formatPrice(25)}`],
                      ] as const
                    ).map(([value, label, price]) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${
                          deliveryOption === value
                            ? "border-[var(--sp-maroon)] bg-[#fff8f0]"
                            : "border-[#ead9cb] bg-[#fbf6f0]/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryOption"
                          value={value}
                          checked={deliveryOption === value}
                          onChange={() => setDeliveryOption(value)}
                          className="accent-[var(--sp-maroon)]"
                        />
                        <span className="flex-1 text-xs font-semibold uppercase tracking-wide">{label}</span>
                        <span className="text-xs text-[var(--sp-muted)]">{price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-[#ead9cb] pt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                    03 / Payment
                  </p>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#ead9cb] bg-[#fbf6f0]/70 p-4">
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-[var(--sp-maroon)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--sp-maroon)]" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Cash on delivery</p>
                      <p className="mt-1 text-xs text-[var(--sp-muted)]">Pay when your order arrives.</p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="sp-panel h-fit p-5 sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                  Your order
                </p>
                <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.product._id}:${item.size || ""}:${item.color || ""}`}
                      className="flex justify-between gap-4 text-xs"
                    >
                      <span className="leading-5">
                        {item.product.name}
                        {item.size ? ` · ${item.size}` : ""} × {item.quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-between border-t border-[#ead9cb] pt-4 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {error ? (
                  <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    {error}
                  </p>
                ) : null}
                {!authenticated ? (
                  <p className="mt-4 text-xs leading-5 text-[var(--sp-muted)]">
                    Please{" "}
                    <a href="/login?next=/checkout" className="font-semibold text-[var(--sp-maroon)] underline">
                      sign in
                    </a>{" "}
                    before placing your order.
                  </p>
                ) : null}
                <button disabled={loading} className="sp-btn mt-6 h-12 w-full justify-center py-0 disabled:opacity-50">
                  {loading ? "Placing order…" : "Place cash-on-delivery order"}
                </button>
                <a
                  href="/cart"
                  className="mt-4 block text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--sp-maroon)] underline underline-offset-4"
                >
                  Back to bag
                </a>
              </aside>
            </form>
          )}
        </div>
      </section>
    </StoreShell>
  );
}
