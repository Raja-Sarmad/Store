"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/api";

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  addItem: (product: Product, size?: string, color?: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "overdose_cart_v1";
export const cartItemKey = (item: Pick<CartItem, "product" | "size" | "color">) =>
  `${item.product._id}:${item.size || ""}:${item.color || ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    ready,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0),
    addItem: (product, size, color) => setItems((current) => {
      const key = cartItemKey({ product, size, color });
      const existing = current.find((item) => cartItemKey(item) === key);
      return existing
        ? current.map((item) => cartItemKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1, size, color }];
    }),
    setQuantity: (key, quantity) => setItems((current) => quantity <= 0
      ? current.filter((item) => cartItemKey(item) !== key)
      : current.map((item) => cartItemKey(item) === key ? { ...item, quantity } : item)),
    removeItem: (key) => setItems((current) => current.filter((item) => cartItemKey(item) !== key)),
    clear: () => setItems([]),
  }), [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
