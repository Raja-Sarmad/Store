import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

const spSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sp-serif",
  display: "swap",
});

const spSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sp-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sab Pehno — Branded Fashion for Everyone",
  description:
    "Discover premium Pakistani wear from top brands at reasonable prices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${spSerif.variable} ${spSans.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
