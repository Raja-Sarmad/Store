"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getAdminDashboardUrl, getMe, getToken, isAdminUser, logout, type User } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    getMe(token)
      .then(setUser)
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHero eyebrow="Customer account" title="Your account" description="Your orders, latest drops, and support links—all in one place." />
      <section className="px-6 py-16 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">
            {user ? `Welcome, ${user.name}` : "Loading..."}
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Your Overdose account is connected with the live backend. Shop, profile, and orders can stay here cleanly.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <a href="/collections" className="border border-zinc-800 bg-black p-4 transition hover:border-white">
              <span className="text-xs font-black uppercase tracking-widest">Shop</span>
              <p className="mt-2 text-xs text-zinc-500">Browse live catalog</p>
            </a>
            <a href="/new-arrival" className="border border-zinc-800 bg-black p-4 transition hover:border-white">
              <span className="text-xs font-black uppercase tracking-widest">New Drops</span>
              <p className="mt-2 text-xs text-zinc-500">Latest dashboard items</p>
            </a>
            <a href="/contact-us" className="border border-zinc-800 bg-black p-4 transition hover:border-white">
              <span className="text-xs font-black uppercase tracking-widest">Support</span>
              <p className="mt-2 text-xs text-zinc-500">Ask about an order</p>
            </a>
          </div>

          {user && isAdminUser(user) && <a href={getAdminDashboardUrl(typeof window === "undefined" ? undefined : window.location.origin)} className="mt-6 inline-flex border border-zinc-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:border-white">
            Open your dashboard →
          </a>}

          <button onClick={async () => { setLoggingOut(true); try { await logout(); } catch { /* Local logout still completes if the API is unavailable. */ } router.replace("/"); }} disabled={loggingOut} className="mt-8 bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-60">
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
