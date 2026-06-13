/** Polymarket prices are 0–1; each value is the implied probability of that outcome. */
export function clampProbability(price: number): number {
  if (!Number.isFinite(price)) return 0;
  return Math.min(1, Math.max(0, price));
}

export function toImpliedPercent(price: number): number {
  return clampProbability(price) * 100;
}
