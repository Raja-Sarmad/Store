/**
 * Storefront prices are stored in USD (same as dashboard).
 * Sab Pehno displays Pakistani Rupees for shoppers.
 */
const PKR_RATE_FROM_USD = 278;

export function toPkr(amountUsd: number) {
  const safe = Number.isFinite(amountUsd) ? Math.max(0, amountUsd) : 0;
  return Math.round(safe * PKR_RATE_FROM_USD);
}

/** e.g. Rs 27,800 */
export function formatPrice(amountUsd: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(toPkr(amountUsd));
}
