"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { isAdminUser, login, openAdminDashboard } from "@/lib/api";

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
        openAdminDashboard(window.location.origin);
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
    <StoreShell>
      <PageHero
        eyebrow="Member access"
        title="Welcome back"
        description="Sign in to check your orders, manage your account, and get back to the pieces you love."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <div className="sp-panel mx-auto max-w-md p-6 sm:p-8">
            <p className="text-sm text-[var(--sp-muted)]">
              Sign in to your Sab Pehno account to continue shopping or open your dashboard.
            </p>
            <form onSubmit={onSubmit} className="mt-7 space-y-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="sp-input"
                placeholder="Email"
                type="email"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="sp-input"
                placeholder="Password"
                type="password"
                required
              />
              {error ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {error}
                </p>
              ) : null}
              <button disabled={loading} className="sp-btn h-12 w-full justify-center py-0 disabled:opacity-60">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p className="mt-6 text-sm text-[var(--sp-muted)]">
              New here?{" "}
              <a
                href="/register"
                onClick={(event) => {
                  const next = new URLSearchParams(window.location.search).get("next");
                  if (next) {
                    event.preventDefault();
                    router.push(`/register?next=${encodeURIComponent(next)}`);
                  }
                }}
                className="font-semibold text-[var(--sp-maroon)] underline underline-offset-4"
              >
                Create your account
              </a>
            </p>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
