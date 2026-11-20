"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { useCart, type CartItem } from "@/components/CartProvider";
import { formatPrice } from "@/lib/money";
import {
  deliveryFeeLabel,
  deliveryFeeUsd,
  isKarachiCity,
  KARACHI_DELIVERY_PKR,
  OUTSIDE_KARACHI_DELIVERY_PKR,
} from "@/lib/shipping";
import { WHATSAPP_DISPLAY, whatsappHref } from "@/lib/whatsapp";
import SpBtnText from "@/components/SpBtnText";

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

type Address = Record<(typeof fields)[number][0], string>;

function buildWhatsAppOrderMessage(
  address: Address,
  items: CartItem[],
  subtotal: number,
  shippingUsd: number,
  totalUsd: number,
) {
  const lines = items.map((item, index) => {
    const bits = [
      `${index + 1}. ${item.product.name}`,
      item.size ? `Size: ${item.size}` : "",
      item.color ? `Color: ${item.color}` : "",
      `Qty: ${item.quantity}`,
      formatPrice(item.product.price * item.quantity),
    ].filter(Boolean);
    return bits.join(" | ");
  });

  return [
    "Assalam o Alaikum Sab Pehno,",
    "New Cash on Delivery order:",
    "",
    "*Customer*",
    `Name: ${address.firstName} ${address.lastName}`.trim(),
    `Phone: ${address.phone}`,
    "",
    "*Delivery address*",
    address.address,
    [address.city, address.state, address.zip].filter(Boolean).join(", "),
    address.country || "Pakistan",
    "",
    "*Items*",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${formatPrice(shippingUsd)} (${deliveryFeeLabel(address.city)})`,
    `*Total: ${formatPrice(totalUsd)}*`,
    "",
    "Payment: Cash on Delivery",
  ].join("\n");
}

export default function CheckoutPage() {
  const { items, subtotal, clear, ready, syncStock } = useCart();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [city, setCity] = useState("");

  const shippingUsd = city.trim() ? deliveryFeeUsd(city) : 0;
  const totalUsd = subtotal + shippingUsd;

  useEffect(() => {
    if (ready && items.length) void syncStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items.length]);

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setError("");

    const form = new FormData(event.currentTarget);
    const shippingAddress = Object.fromEntries(
      fields.map(([name]) => [name, String(form.get(name) || "").trim()]),
    ) as Address;

    if (!shippingAddress.city.trim()) {
      setError("Please enter your city so we can calculate delivery charges.");
      return;
    }

    const message = buildWhatsAppOrderMessage(
      shippingAddress,
      items,
      subtotal,
      deliveryFeeUsd(shippingAddress.city),
      subtotal + deliveryFeeUsd(shippingAddress.city),
    );

    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
    clear();
    setSent(true);
  }

  return (
    <StoreShell>
      <PageHero
        eyebrow="Almost yours"
        title="Checkout"
        description="Add your delivery details, then send the order on WhatsApp. Delivery is Rs 300 in Karachi and Rs 350 elsewhere."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          {sent ? (
            <div className="sp-panel mx-auto max-w-2xl px-6 py-12 text-center sm:px-10">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--sp-muted)]">
                WhatsApp order
              </span>
              <h2 className="mt-4 font-serif text-3xl font-medium text-[var(--sp-maroon-deep)] sm:text-4xl">
                Order opened on WhatsApp.
              </h2>
              <p className="mt-4 text-sm text-[var(--sp-muted)]">
                Your details and bag items were filled in a message to{" "}
                <b>{WHATSAPP_DISPLAY}</b>. Send it on WhatsApp to confirm your cash-on-delivery order.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappHref("Hi Sab Pehno, I just submitted an order from the website.")}
                  target="_blank"
                  rel="noreferrer"
                  className="sp-btn"
                >
                  Open WhatsApp again
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
                  {fields.map(([name, label, required]) => {
                    const isCity = name === "city";
                    return (
                      <label
                        key={name}
                        className={`sp-label ${name === "address" ? "sm:col-span-2" : ""}`}
                      >
                        {label}
                        <input
                          name={name}
                          required={required}
                          {...(isCity
                            ? {
                                value: city,
                                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                                  setCity(event.target.value),
                                list: "checkout-cities",
                                placeholder: "e.g. Karachi, Lahore, Islamabad",
                              }
                            : name === "country"
                              ? { defaultValue: "Pakistan" }
                              : {})}
                          autoComplete={
                            name === "address"
                              ? "street-address"
                              : name === "firstName" || name === "lastName"
                                ? name
                                : name === "zip"
                                  ? "postal-code"
                                  : name === "phone"
                                    ? "tel"
                                    : name === "city"
                                      ? "address-level2"
                                      : name === "country"
                                        ? "country-name"
                                        : "on"
                          }
                          className="sp-input font-normal normal-case tracking-normal"
                        />
                      </label>
                    );
                  })}
                  <datalist id="checkout-cities">
                    {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot"].map(
                      (option) => (
                        <option key={option} value={option} />
                      ),
                    )}
                  </datalist>
                </div>

                <div className="mt-8 rounded-2xl border border-[#ead9cb] bg-[#fff8f0]/80 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--sp-muted)]">
                    02 / Delivery charges
                  </p>
                  <p className="mt-3 text-sm text-[var(--sp-ink)]">
                    {city.trim()
                      ? isKarachiCity(city)
                        ? `Karachi delivery — Rs ${KARACHI_DELIVERY_PKR}`
                        : `Outside Karachi — Rs ${OUTSIDE_KARACHI_DELIVERY_PKR}`
                      : "Enter your city above to see the delivery charge."}
                  </p>
                  <p className="mt-2 text-xs text-[var(--sp-muted)]">
                    Within Karachi: Rs {KARACHI_DELIVERY_PKR} · Rest of Pakistan: Rs {OUTSIDE_KARACHI_DELIVERY_PKR}
                  </p>
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
                      <p className="mt-1 text-xs text-[var(--sp-muted)]">
                        Order goes to WhatsApp ({WHATSAPP_DISPLAY}). Pay when it arrives.
                      </p>
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
                <div className="mt-5 space-y-3 border-t border-[#ead9cb] pt-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-medium">
                      {city.trim() ? formatPrice(shippingUsd) : "—"}
                    </span>
                  </div>
                  {city.trim() ? (
                    <p className="text-[11px] text-[var(--sp-muted)]">{deliveryFeeLabel(city)}</p>
                  ) : null}
                  <div className="flex justify-between border-t border-[#ead9cb] pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>{city.trim() ? formatPrice(totalUsd) : formatPrice(subtotal)}</span>
                  </div>
                </div>
                {error ? (
                  <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    {error}
                  </p>
                ) : null}
                <button type="submit" className="sp-btn mt-6 h-12 w-full justify-center py-0">
                  <SpBtnText>Place order on WhatsApp</SpBtnText>
                </button>
                <p className="mt-3 text-center text-[11px] leading-5 text-[var(--sp-muted)]">
                  Opens WhatsApp with your details ready to send to {WHATSAPP_DISPLAY}.
                </p>
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
