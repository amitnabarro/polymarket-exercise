import type { Event } from "@/lib/types/polymarket";
import { matchesCategory } from "./category";

export type CryptoAssetFilter = "all" | "bitcoin" | "ethereum" | "solana" | "xrp";

export const CRYPTO_FILTERS: { label: string; value: CryptoAssetFilter }[] = [
  { label: "All", value: "all" },
  { label: "Bitcoin", value: "bitcoin" },
  { label: "Ethereum", value: "ethereum" },
  { label: "Solana", value: "solana" },
  { label: "XRP", value: "xrp" },
];

const ASSET_KEYWORDS: Record<Exclude<CryptoAssetFilter, "all">, string[]> = {
  bitcoin: ["bitcoin", "btc"],
  ethereum: ["ethereum", "eth"],
  solana: ["solana", "sol"],
  xrp: ["xrp", "ripple"],
};

export function isLiveCryptoMarket(event: Event): boolean {
  const title = event.title.toLowerCase();
  return (
    title.includes("up or down") ||
    title.includes("up/down") ||
    /\d{1,2}:\d{2}/.test(event.title)
  );
}

export function isThresholdCryptoMarket(event: Event): boolean {
  const title = event.title.toLowerCase();
  return title.includes("above") || title.includes("below") || title.includes("hit");
}

export function detectCryptoAsset(event: Event): string {
  const text = event.title.toLowerCase();
  if (text.includes("bitcoin") || text.includes("btc")) return "Bitcoin";
  if (text.includes("ethereum") || text.includes("eth")) return "Ethereum";
  if (text.includes("solana") || text.includes("sol")) return "Solana";
  if (text.includes("xrp")) return "XRP";
  return "Crypto";
}

export function matchesCryptoFilter(event: Event, filter: CryptoAssetFilter): boolean {
  if (!matchesCategory(event, "crypto")) return false;
  if (filter === "all") return true;
  const keywords = ASSET_KEYWORDS[filter];
  const text = event.title.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}
