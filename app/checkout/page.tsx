"use client";

import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useCart } from "@/components/CartProvider";
import { createOrder, getToken } from "@/lib/api";

const fields = [
  ["firstName", "First name", true], ["lastName", "Last name", true],
  ["phone", "Phone number", true], ["address", "Street address", true],
  ["city", "City", true], ["state", "State / province", true],
  ["zip", "Postal code", true], ["country", "Country", true],
] as const;

export default function CheckoutPage() {
  const { items, subtotal, clear, ready } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express" | "nextday">("standard");

  useEffect(() => setAuthenticated(Boolean(getToken())), []);

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
    const shippingAddress = Object.fromEntries(fields.map(([name]) => [name, String(form.get(name) || "").trim()])) as Record<(typeof fields)[number][0], string>;
    try {
      const order = await createOrder({
        items: items.map(({ product, quantity, size, color }) => ({ productId: product._id, quantity, size, color })),
        shippingAddress,
        paymentMethod: "cod",
        deliveryOption,
      }, token);
      setOrderNumber(order.number);
      clear();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHero eyebrow="Almost yours" title="Checkout" description="Add your delivery details and choose how your order gets to you." />
      <section className="bg-white px-6 py-14 text-black sm:px-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {orderNumber ? <div className="mx-auto max-w-2xl border border-zinc-200 px-6 py-14 text-center sm:px-12">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Order confirmed</span>
            <h2 className="mt-4 text-4xl font-black uppercase">You&apos;re all set.</h2>
            <p className="mt-4 text-sm text-zinc-600">Your order <b>#{orderNumber}</b> has been placed with cash on delivery. Track it anytime from your account.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><a href="/account" className="bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">View my orders</a><a href="/collections" className="border border-zinc-300 px-6 py-3 text-xs font-bold uppercase tracking-widest">Keep shopping</a></div>
          </div> : !ready ? <p className="py-12 text-sm text-zinc-500">Loading your checkout…</p> : items.length === 0 ? <div className="py-14 text-center"><h2 className="text-3xl font-black uppercase">Your bag is empty.</h2><a href="/collections" className="mt-6 inline-block bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Shop collections</a></div> : (
            <form onSubmit={placeOrder} className="grid gap-12 lg:grid-cols-[1fr_360px]">
              <div>
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">01 / Delivery address</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map(([name, label, required]) => <label key={name} className={`flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest ${name === "address" ? "sm:col-span-2" : ""}`}>
                    {label}<input name={name} required={required} autoComplete={name === "address" ? "street-address" : name === "firstName" || name === "lastName" ? name : name === "zip" ? "postal-code" : name === "phone" ? "tel" : "on"} className="h-12 border border-zinc-300 px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-black" />
                  </label>)}
                </div>
                <div className="mt-10">
                  <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">02 / Delivery speed</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {([["standard", "Standard", "Store rate"] , ["express", "Express", "+$12"], ["nextday", "Next day", "+$25"]] as const).map(([value, label, price]) => <label key={value} className={`flex cursor-pointer items-center gap-3 border p-4 ${deliveryOption === value ? "border-black bg-zinc-50" : "border-zinc-200"}`}>
                      <input type="radio" name="deliveryOption" value={value} checked={deliveryOption === value} onChange={() => setDeliveryOption(value)} className="accent-black" />
                      <span className="flex-1 text-xs font-bold uppercase tracking-wide">{label}</span><span className="font-mono text-xs text-zinc-500">{price}</span>
                    </label>)}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">Standard delivery price is set by the store and shown in your confirmed order total.</p>
                </div>
                <div className="mt-10 border-t border-zinc-200 pt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">03 / Payment</p>
                  <div className="mt-4 flex items-center gap-3 border border-zinc-200 p-4"><span className="grid h-5 w-5 place-items-center rounded-full border border-black"><span className="h-2 w-2 rounded-full bg-black" /></span><div><p className="text-xs font-bold uppercase tracking-wide">Cash on delivery</p><p className="mt-1 text-xs text-zinc-500">Pay when your order arrives.</p></div></div>
                </div>
              </div>
              <aside className="h-fit border border-zinc-200 p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Your order</p>
                <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">
                  {items.map((item) => <div key={`${item.product._id}:${item.size || ""}:${item.color || ""}`} className="flex justify-between gap-4 text-xs"><span className="leading-5">{item.product.name}{item.size ? ` · ${item.size}` : ""} × {item.quantity}</span><span className="shrink-0 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span></div>)}
                </div>
                <div className="mt-5 flex justify-between border-t border-zinc-200 pt-4 text-sm"><span>Subtotal</span><span className="font-mono">${subtotal.toFixed(2)} USD</span></div>
                <p className="mt-3 text-xs text-zinc-500">Shipping, tax and final total are calculated by the store when your order is placed.</p>
                {error && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</p>}
                {!authenticated && <p className="mt-4 text-xs leading-5 text-zinc-500">Please <a href="/login?next=/checkout" className="font-bold underline">sign in</a> before placing your order.</p>}
                <button disabled={loading} className="mt-6 h-12 w-full bg-black px-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-zinc-700 disabled:opacity-50">{loading ? "Placing order…" : "Place cash-on-delivery order"}</button>
                <a href="/cart" className="mt-4 block text-center text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Back to bag</a>
              </aside>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
