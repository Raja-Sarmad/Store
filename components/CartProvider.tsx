"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/api";
import { getProductStock } from "@/lib/api";
import { applyStockSnapshot, availableStock, clampCartToStock } from "@/lib/stock";

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
  addItem: (product: Product, size?: string, color?: string, quantity?: number) => boolean;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  syncStock: () => Promise<void>;
  maxQuantityFor: (item: CartItem) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "overdose_cart_v1";
export const cartItemKey = (item: Pick<CartItem, "product" | "size" | "color">) =>
  `${item.product._id}:${item.size || ""}:${item.color || ""}`;

function maxForLine(items: CartItem[], item: CartItem): number {
  const stock = availableStock(item.product, item.size);
  if (item.product.variants && item.product.variants.length > 0) return stock;
  const others = items
    .filter((row) => row.product._id === item.product._id && cartItemKey(row) !== cartItemKey(item))
    .reduce((sum, row) => sum + row.quantity, 0);
  return Math.max(0, stock - others);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(clampCartToStock(JSON.parse(saved) as CartItem[]));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const syncStock = useCallback(async () => {
    const ids = [...new Set(items.map((item) => item.product._id))];
    if (!ids.length) return;
    try {
      const rows = await getProductStock(ids);
      setItems((current) => applyStockSnapshot(current, rows));
    } catch {
      // Keep local cart if stock lookup fails; checkout still validates server-side.
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    ready,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0),
    addItem: (product, size, color, quantity = 1) => {
      const addQty = Math.max(1, Math.floor(Number(quantity) || 1));
      const key = cartItemKey({ product, size, color });
      const existing = items.find((item) => cartItemKey(item) === key);
      const stock = availableStock(product, size);
      if (stock <= 0) return false;

      let take = 0;
      if (product.variants && product.variants.length > 0) {
        const already = existing?.quantity || 0;
        const nextQty = Math.min(stock, already + addQty);
        take = nextQty - already;
      } else {
        const already = items
          .filter((item) => item.product._id === product._id)
          .reduce((sum, item) => sum + item.quantity, 0);
        take = Math.min(addQty, Math.max(0, stock - already));
      }
      if (take <= 0) return false;

      setItems((current) => {
        const liveExisting = current.find((item) => cartItemKey(item) === key);
        if (product.variants && product.variants.length > 0) {
          const already = liveExisting?.quantity || 0;
          const nextQty = Math.min(availableStock(product, size), already + take);
          if (nextQty <= already) return current;
          if (liveExisting) {
            return current.map((item) =>
              cartItemKey(item) === key ? { ...item, product, quantity: nextQty, size, color } : item,
            );
          }
          return [...current, { product, quantity: nextQty, size, color }];
        }

        const already = current
          .filter((item) => item.product._id === product._id)
          .reduce((sum, item) => sum + item.quantity, 0);
        const room = Math.max(0, availableStock(product) - already);
        const actualTake = Math.min(take, room);
        if (actualTake <= 0) return current;
        if (liveExisting) {
          return current.map((item) =>
            cartItemKey(item) === key
              ? { ...item, product, quantity: item.quantity + actualTake, size, color }
              : item,
          );
        }
        return [...current, { product, quantity: actualTake, size, color }];
      });
      return true;
    },
    setQuantity: (key, quantity) =>
      setItems((current) => {
        const target = current.find((item) => cartItemKey(item) === key);
        if (!target) return current;
        if (quantity <= 0) return current.filter((item) => cartItemKey(item) !== key);
        const max = maxForLine(current, target);
        const nextQty = Math.min(Math.max(1, Math.floor(quantity)), max);
        if (nextQty <= 0) return current.filter((item) => cartItemKey(item) !== key);
        return current.map((item) =>
          cartItemKey(item) === key ? { ...item, quantity: nextQty } : item,
        );
      }),
    removeItem: (key) => setItems((current) => current.filter((item) => cartItemKey(item) !== key)),
    clear: () => setItems([]),
    syncStock,
    maxQuantityFor: (item) => maxForLine(items, item),
  }), [items, ready, syncStock]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
