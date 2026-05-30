export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export const currencyCentsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrencyCents(value: number) {
  return currencyCentsFormatter.format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 10) / 10}%`;
}
