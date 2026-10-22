import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminDashboardUrl } from "@/lib/api";

function resolveOrigin(h: Headers) {
  const host = h.get("x-forwarded-host") || h.get("host");
  if (!host) return undefined;
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function AdminAliasPage() {
  const h = await headers();
  const origin = resolveOrigin(h);
  const target = getAdminDashboardUrl(origin);

  // Relative fallback means production env is missing a real admin URL.
  // Do not redirect to /admin again (infinite loop).
  if (target.startsWith("/")) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Admin dashboard</p>
          <h1 className="mt-3 text-2xl font-semibold">Dashboard URL not configured</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Set <code className="text-zinc-200">NEXT_PUBLIC_ADMIN_DASHBOARD_URL</code> on Vercel to your
            live shared dashboard app, for example:
          </p>
          <p className="mt-3 break-all rounded bg-black px-3 py-2 text-left text-xs text-emerald-300">
            https://e-commerce-steel-psi.vercel.app/admin?store=store
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Then redeploy this Store project. Localhost admin URLs are ignored in production.
          </p>
          <a
            href="/account"
            className="mt-8 inline-flex border border-zinc-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:border-white"
          >
            Back to account
          </a>
        </div>
      </main>
    );
  }

  redirect(target);
}
