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
  price: number;
  compareAtPrice?: number | null;
  category?: string;
  description?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  variants?: { size: string; stock: number }[];
  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  onSale?: boolean;
  tags?: string[];
  isBestSeller?: boolean;
  totalSold?: number;
};

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

const DEFAULT_ADMIN_DASHBOARD_URL = "http://localhost:3001/admin?store=store";

export function getAdminDashboardUrl(currentOrigin?: string) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || DEFAULT_ADMIN_DASHBOARD_URL;

  if (!currentOrigin) return configuredUrl;

  try {
    const url = new URL(configuredUrl);
    if (url.origin === currentOrigin) return DEFAULT_ADMIN_DASHBOARD_URL;
  } catch {
    return configuredUrl;
  }

  return configuredUrl;
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
