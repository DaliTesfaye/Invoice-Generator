export const supportedCurrencies = ["USD", "TND", "EUR"] as const;

export type SupportedCurrency = (typeof supportedCurrencies)[number];

export function isSupportedCurrency(value: unknown): value is SupportedCurrency {
  return typeof value === "string" && supportedCurrencies.includes(value as SupportedCurrency);
}
