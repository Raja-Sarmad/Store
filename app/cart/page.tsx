"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { cartItemKey, useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, removeItem } = useCart();
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHero eyebrow="Your selections" title="Shopping bag" description="Review your pieces and get them on the way." />
      <section className="bg-white px-6 py-14 text-black sm:px-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {!ready ? <p className="py-12 text-sm text-zinc-500">Loading your bag…</p> : !items.length ? (
            <div className="border-y border-zinc-200 py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Your bag is waiting</p>
              <h2 className="mt-3 text-3xl font-black uppercase">Nothing in here yet.</h2>
              <a href="/collections" className="mt-7 inline-flex bg-black px-7 py-4 text-xs font-bold uppercase tracking-widest text-white">Explore the collection →</a>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
              <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                {items.map((item) => {
                  const key = cartItemKey(item);
                  return <article key={key} className="grid grid-cols-[96px_1fr] gap-4 py-5 sm:grid-cols-[128px_1fr_auto] sm:gap-6">
                    <img src={item.product.images?.[0] || "/hero image.png"} alt={item.product.name} className="aspect-[3/4] w-full bg-zinc-100 object-cover" />
                    <div className="flex min-w-0 flex-col justify-between py-1">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{item.product.brand || "Overdose"}</p>
                        <h2 className="mt-1 text-sm font-bold uppercase tracking-wide">{item.product.name}</h2>
                        {(item.size || item.color) && <p className="mt-2 text-xs text-zinc-500">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}</p>}
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex h-9 items-center border border-zinc-300">
                          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(key, item.quantity - 1)} className="h-full px-3 text-zinc-600 hover:text-black">−</button>
                          <span className="min-w-7 text-center text-xs">{item.quantity}</span>
                          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(key, item.quantity + 1)} className="h-full px-3 text-zinc-600 hover:text-black">+</button>
                        </div>
                        <button type="button" onClick={() => removeItem(key)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 underline underline-offset-4 hover:text-black">Remove</button>
                      </div>
                    </div>
                    <p className="col-start-2 row-start-2 self-start text-right font-mono text-sm sm:col-start-3 sm:row-start-1">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                  </article>;
                })}
              </div>
              <aside className="h-fit border border-zinc-200 p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Order summary</p>
                <div className="mt-6 flex justify-between border-b border-zinc-200 pb-4 text-sm"><span>Subtotal</span><span className="font-mono">${subtotal.toFixed(2)} USD</span></div>
                <p className="mt-4 text-xs leading-5 text-zinc-500">Delivery charges and final total are calculated securely at checkout.</p>
                <a href="/checkout" className="mt-7 flex h-12 items-center justify-center bg-black text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-700">Continue to checkout →</a>
                <a href="/collections" className="mt-4 block text-center text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Keep shopping</a>
              </aside>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
