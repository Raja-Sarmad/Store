"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getAdminDashboardUrl, isAdminUser, login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (isAdminUser(user)) {
        window.location.href = getAdminDashboardUrl(window.location.origin);
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <PageHero eyebrow="Member access" title="Welcome back" description="Sign in to check your orders, manage your account, and get back to the pieces you love." />
      <section className="px-6 py-16 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-md border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <p className="text-sm text-zinc-400">Sign in to your Overdose account to continue shopping or open your dashboard.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Email" type="email" required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white" placeholder="Password" type="password" required />
            {error && <p className="border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
            <button disabled={loading} className="w-full bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-zinc-200 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-sm text-zinc-400">New to Overdose? <a href="/register" onClick={(event) => { const next = new URLSearchParams(window.location.search).get("next"); if (next) { event.preventDefault(); router.push(`/register?next=${encodeURIComponent(next)}`); } }} className="font-bold text-white underline underline-offset-4">Create your account</a></p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
