import { PKR_RATE_FROM_USD } from "./money";

/** Sab Pehno delivery charges (display PKR). */
export const KARACHI_DELIVERY_PKR = 300;
export const OUTSIDE_KARACHI_DELIVERY_PKR = 350;

export function isKarachiCity(city = "") {
  return /karachi/i.test(String(city).trim());
}

/** USD amount stored in orders so formatPrice shows Rs 300 / Rs 400. */
export function deliveryFeeUsd(city = "") {
  const pkr = isKarachiCity(city) ? KARACHI_DELIVERY_PKR : OUTSIDE_KARACHI_DELIVERY_PKR;
  return pkr / PKR_RATE_FROM_USD;
}

export function deliveryFeeLabel(city = "") {
  if (!String(city).trim()) return "Enter city to calculate";
  return isKarachiCity(city)
    ? `Karachi — Rs ${KARACHI_DELIVERY_PKR}`
    : `Outside Karachi — Rs ${OUTSIDE_KARACHI_DELIVERY_PKR}`;
}
