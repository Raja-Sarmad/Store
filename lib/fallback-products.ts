import type { Product } from "./api";

export const fallbackProducts: Product[] = [
  {
    _id: "fallback-1",
    name: "Heavyweight Oversized Tee",
    price: 45,
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"],
    colors: ["black", "white"],
    isNew: true,
  },
  {
    _id: "fallback-2",
    name: "Vintage Wash Logo Tee",
    price: 40,
    images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"],
    colors: ["white", "black"],
    isFeatured: true,
  },
  {
    _id: "fallback-3",
    name: "Signature Hoodie V.01",
    price: 85,
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"],
    colors: ["black", "gray"],
    isNew: true,
  },
  {
    _id: "fallback-4",
    name: "Acid Wash Crewneck",
    price: 75,
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"],
    colors: ["gray", "silver"],
    onSale: true,
  },
];
