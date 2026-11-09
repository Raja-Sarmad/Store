/** Sab Pehno WhatsApp — display + wa.me digits. */
export const WHATSAPP_DISPLAY = "+92 346 4357392";
export const WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923464357392").replace(/\D/g, "") ||
  "923464357392";

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
