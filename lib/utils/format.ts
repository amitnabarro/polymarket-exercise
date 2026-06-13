import { clampProbability, toImpliedPercent } from "./price";

export function parseJsonArray<T>(value: string): T[] {
  try {
    return JSON.parse(value) as T[];
  } catch {
    return [];
  }
}

export function formatVolume(value: number | undefined): string {
  if (value === undefined || value === null) return "$0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatPercent(price: number): string {
  const pct = toImpliedPercent(price);
  if (pct < 1 && pct > 0) return "<1%";
  if (pct > 99 && pct < 100) return ">99%";
  return `${Math.round(pct)}%`;
}

export function formatPercentPrecise(price: number): string {
  const pct = toImpliedPercent(price);
  if (pct < 0.1 && pct > 0) return "<0.1%";
  if (pct > 99.9 && pct < 100) return ">99.9%";
  return `${pct.toFixed(1)}%`;
}

export function formatCents(price: number): string {
  const cents = clampProbability(price) * 100;
  if (cents < 0.1 && cents > 0) return "<0.1¢";
  return `${cents.toFixed(1)}¢`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatPnl(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${formatVolume(value)}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}
