import type { Product } from "@/lib/api";

type StockCartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

/** Units available for a size (or the whole product when there are no variants). */
export function availableStock(product: Pick<Product, "stock" | "variants">, size?: string): number {
  if (product.variants && product.variants.length > 0) {
    if (!size) return 0;
    const variant = product.variants.find((row) => row.size === size);
    return Math.max(0, Number(variant?.stock ?? 0));
  }
  return Math.max(0, Number(product.stock ?? 0));
}

/** How many units of this product(+size) are already in the bag. */
export function cartQtyForStock(
  items: StockCartItem[],
  product: Pick<Product, "_id" | "variants">,
  size?: string,
): number {
  if (product.variants && product.variants.length > 0) {
    return items
      .filter((item) => item.product._id === product._id && (item.size || "") === (size || ""))
      .reduce((sum, item) => sum + item.quantity, 0);
  }
  return items
    .filter((item) => item.product._id === product._id)
    .reduce((sum, item) => sum + item.quantity, 0);
}

/** Remaining units that can still be added for this product(+size). */
export function remainingStock(
  items: StockCartItem[],
  product: Product,
  size?: string,
): number {
  return Math.max(0, availableStock(product, size) - cartQtyForStock(items, product, size));
}

export function isSoldOut(product: Pick<Product, "stock" | "variants">): boolean {
  if (product.variants && product.variants.length > 0) {
    return product.variants.every((row) => Math.max(0, Number(row.stock ?? 0)) <= 0);
  }
  return Math.max(0, Number(product.stock ?? 0)) <= 0;
}

/**
 * Clamp every cart line to live stock.
 * Products without size variants share one pool across all size/color lines.
 */
export function clampCartToStock<T extends StockCartItem>(items: T[]): T[] {
  const withVariants = items.map((item) => {
    if (!(item.product.variants && item.product.variants.length > 0)) return item;
    const max = availableStock(item.product, item.size);
    return { ...item, quantity: Math.min(item.quantity, max) };
  });

  const sharedUsed = new Map<string, number>();
  const clamped = withVariants.map((item) => {
    if (item.product.variants && item.product.variants.length > 0) {
      return item.quantity > 0 ? item : null;
    }
    const max = availableStock(item.product);
    const used = sharedUsed.get(item.product._id) || 0;
    const allowed = Math.max(0, max - used);
    const quantity = Math.min(item.quantity, allowed);
    sharedUsed.set(item.product._id, used + quantity);
    return quantity > 0 ? { ...item, quantity } : null;
  });

  return clamped.filter((item): item is T => Boolean(item));
}

export function applyStockSnapshot<T extends StockCartItem>(
  items: T[],
  rows: { id: string; stock: number; variants?: Record<string, number> | null }[],
): T[] {
  const map = new Map(rows.map((row) => [row.id, row]));
  const refreshed = items.map((item) => {
    const row = map.get(item.product._id);
    if (!row) {
      return {
        ...item,
        product: {
          ...item.product,
          stock: 0,
          variants: item.product.variants?.map((variant) => ({ ...variant, stock: 0 })),
        },
      };
    }
    const variants =
      row.variants && Object.keys(row.variants).length > 0
        ? Object.entries(row.variants).map(([size, stock]) => ({
            size,
            stock: Math.max(0, Number(stock) || 0),
          }))
        : item.product.variants;
    return {
      ...item,
      product: {
        ...item.product,
        stock: Math.max(0, Number(row.stock) || 0),
        variants,
      },
    };
  });
  return clampCartToStock(refreshed);
}
