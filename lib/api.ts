// This app is the Overdose storefront; never inherit NovaMart's tenant slug.
export const STORE_SLUG = "store";

const PRODUCTION_API_URL = "https://e-commerce-backend-sigma-rose.vercel.app/api/v1";
const LOCAL_API_URL = "http://localhost:5000/api/v1";
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
const configuredLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(configuredApiUrl || "");

// A copied local .env must never make a production build call the visitor's localhost.
export const API_URL = configuredApiUrl && !(process.env.NODE_ENV === "production" && configuredLocalApi)
  ? configuredApiUrl
  : process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : LOCAL_API_URL;

export type Product = {
  _id: string;
  name: string;
  slug?: string;
  brand?: string;
  gender?: "men" | "women" | "unisex";
  wearType?: "stitched" | "unstitched" | "modelwear" | "";
  price: number;
  compareAtPrice?: number | null;
  discountPercent?: number;
  category?: string;
  categorySlug?: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, string> | null;
  materials?: string;
  sizeGuide?: string;
  shippingInfo?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  variants?: { size: string; stock: number }[];
  stock?: number;
  sku?: string;
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  isTrending?: boolean;
  onSale?: boolean;
  tags?: string[];
  isBestSeller?: boolean;
  totalSold?: number;
  related?: Product[];
};

/** Storefront PDP path — prefers slug, falls back to id. */
export function productHref(product: Pick<Product, "_id" | "slug">) {
  return `/product/${encodeURIComponent(product.slug || product._id)}`;
}

export type Category = { _id: string; name: string; slug: string; count: number };
export type CatalogMeta = { page: number; total: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
};

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
};

export function isAdminUser(user?: Pick<User, "role"> | null) {
  return ["admin", "super_admin", "manager", "staff"].includes(user?.role || "");
}

/** Shared multi-tenant admin (`dashboard` app, port 3001 locally) with Sab Pehno selected. */
const DEFAULT_LOCAL_ADMIN_DASHBOARD_URL = "http://localhost:3001/admin?store=store";
const DEFAULT_PRODUCTION_ADMIN_DASHBOARD_URL =
  "https://e-commerce-steel-psi.vercel.app/admin?store=store";

function isLocalHostUrl(value: string) {
  return /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value.trim());
}

/**
 * One shared dashboard for all storefronts (see shared/ADMIN.md).
 * Sab Pehno login → /admin?store=store (forced — env cannot open NovaMart by mistake)
 * Warqu → /admin?store=warqu
 * NovaMart → /admin?store=ecommerce
 *
 * Vercel Store project must set NEXT_PUBLIC_ADMIN_DASHBOARD_URL to the live dashboard URL.
 * Never send a live visitor to localhost.
 */
export function getAdminDashboardUrl(currentOrigin?: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL?.trim() || "";
  const originIsLocal = !currentOrigin || isLocalHostUrl(currentOrigin);
  const fallback = originIsLocal
    ? DEFAULT_LOCAL_ADMIN_DASHBOARD_URL
    : DEFAULT_PRODUCTION_ADMIN_DASHBOARD_URL;

  const candidate = configuredUrl || fallback;
  const safe =
    !originIsLocal && isLocalHostUrl(candidate)
      ? DEFAULT_PRODUCTION_ADMIN_DASHBOARD_URL
      : candidate;

  try {
    const url = new URL(safe, originIsLocal ? "http://localhost:3001" : undefined);
    if (!url.pathname.startsWith("/admin")) url.pathname = "/admin";
    url.searchParams.set("store", STORE_SLUG);
    return url.toString();
  } catch {
    return fallback;
  }
}

/** Open shared admin and hand over the access token (different Vercel apps). */
export function openAdminDashboard(currentOrigin?: string) {
  const base = getAdminDashboardUrl(currentOrigin);
  const token = typeof window !== "undefined" ? getToken() : "";
  if (!token) {
    window.location.href = base;
    return;
  }
  const url = new URL(base);
  url.hash = `access_token=${encodeURIComponent(token)}`;
  window.location.href = url.toString();
}

type Envelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: unknown;
  accessToken?: string;
};

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("store_access_token") || "";
}

export function setToken(token: string) {
  localStorage.setItem("store_access_token", token);
}

export function clearToken() {
  localStorage.removeItem("store_access_token");
  localStorage.removeItem("novamart_access_token");
  sessionStorage.removeItem("novamart_access_token");
}

function headers(token?: string) {
  const h: HeadersInit = {
    "Content-Type": "application/json",
    "X-Store-Slug": STORE_SLUG,
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

let pendingRefresh: Promise<void> | null = null;

async function refreshSession() {
  if (!pendingRefresh) {
    const previousToken = getToken();
    pendingRefresh = (async () => {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: headers(),
        credentials: "include",
        cache: "no-store",
      });
      const json = (await res.json().catch(() => ({}))) as Envelope<unknown>;
      // Never let an old refresh overwrite a newer login or logout.
      if (getToken() !== previousToken) return;
      if (res.ok && json.accessToken) setToken(json.accessToken);
      else if (res.status === 401 || res.status === 403) clearToken();
      else throw new Error(json.message || "Could not restore your session. Please try again.");
    })().finally(() => { pendingRefresh = null; });
  }
  await pendingRefresh;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
) {
  const request = (token?: string) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers(token), ...(options.headers || {}) },
    credentials: "include",
    cache: "no-store",
  });
  let res = await request(options.token);
  const canRefresh = !path.startsWith("/auth/") || path === "/auth/logout";
  if (res.status === 401 && canRefresh && typeof window !== "undefined") {
    if (!getToken() || getToken() === options.token) await refreshSession();
    const token = getToken();
    if (token) res = await request(token);
  }
  const json = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  if (json.accessToken && typeof window !== "undefined") setToken(json.accessToken);
  return (json.data ?? null) as T;
}

export async function getProducts(params = "") {
  const query = params ? `?${params}` : "";
  return apiFetch<Product[]>(`/products${query}`);
}

/** Full product + related — same fields the dashboard manages. */
export async function getProductBySlug(slug: string) {
  return apiFetch<Product>(`/products/slug/${encodeURIComponent(slug)}`);
}

export async function createOrder(payload: {
  items: { productId: string; quantity: number; size?: string; color?: string }[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod";
  deliveryOption: "standard" | "express" | "nextday";
}, token: string) {
  return apiFetch<{ number: string; total: number }>("/orders", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(token = getToken()) {
  try {
    if (token) await apiFetch<void>("/auth/logout", { method: "POST", token });
  } finally {
    clearToken();
  }
}

export async function sendEmailOtp(email: string) {
  return apiFetch<{ sent: boolean; devMode?: boolean; devOtp?: string }>("/auth/email-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function register(name: string, email: string, password: string, otp: string) {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, otp }),
  });
}

export async function getMe(token: string) {
  return apiFetch<User>("/users/me", { token });
}

export async function createProduct(payload: Partial<Product> & { imageUrls?: string[] }, token: string) {
  return apiFetch<Product>("/products/admin", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string, token: string) {
  return apiFetch<void>(`/products/admin/${id}`, {
    method: "DELETE",
    token,
  });
}
