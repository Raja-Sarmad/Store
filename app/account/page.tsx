"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StoreShell from "@/components/StoreShell";
import PageHero from "@/components/PageHero";
import { getMe, getToken, isAdminUser, logout, openAdminDashboard, type User } from "@/lib/api";

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
    <StoreShell>
      <PageHero
        eyebrow="Customer account"
        title="Your account"
        description="Your orders, latest drops, and support links—all in one place."
      />
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="sp-container">
          <div className="sp-panel mx-auto max-w-3xl p-6 sm:p-8">
            <h2 className="font-serif text-3xl font-medium text-[var(--sp-maroon-deep)] sm:text-4xl">
              {user ? `Welcome, ${user.name}` : "Loading..."}
            </h2>
            <p className="mt-3 text-sm text-[var(--sp-muted)]">
              Your Sab Pehno account is connected. Shop, profile, and orders stay here cleanly.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/orders", title: "My Orders", copy: "View what you ordered" },
                { href: "/collections", title: "Shop", copy: "Browse live catalog" },
                { href: "/new-arrival", title: "New Drops", copy: "Latest arrivals" },
                { href: "/contact-us", title: "Support", copy: "Ask about an order" },
              ].map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  className="rounded-2xl border border-[#ead9cb] bg-[#fbf6f0]/80 p-4 transition hover:border-[var(--sp-maroon)]"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--sp-maroon)]">
                    {card.title}
                  </span>
                  <p className="mt-2 text-xs text-[var(--sp-muted)]">{card.copy}</p>
                </a>
              ))}
            </div>

            {user && isAdminUser(user) ? (
              <button
                type="button"
                onClick={() => openAdminDashboard(window.location.origin)}
                className="sp-btn-outline mt-6"
              >
                Open your dashboard →
              </button>
            ) : null}

            <button
              onClick={async () => {
                setLoggingOut(true);
                try {
                  await logout();
                } catch {
                  /* Local logout still completes if the API is unavailable. */
                }
                router.replace("/");
              }}
              disabled={loggingOut}
              className="sp-btn mt-8 disabled:opacity-60"
            >
              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
