import type { Event, Market } from "@/lib/types/polymarket";
import { parseJsonArray } from "./format";

export function getMarketTokenIds(market: Market): string[] {
  return parseJsonArray<string>(market.clobTokenIds ?? "[]");
}

function getYesTokenId(market: Market): string | null {
  const tokens = getMarketTokenIds(market);
  const outcomes = parseJsonArray<string>(market.outcomes);
  const yesIndex = outcomes.findIndex((o) => o === "Yes");
  if (yesIndex >= 0 && tokens[yesIndex]) return tokens[yesIndex];
  return tokens[0] ?? null;
}

export function getTokenIdsForEvent(event: Event, outcomeLimit = 4): string[] {
  const activeMarkets = event.markets.filter((m) => m.active && !m.closed);
  const markets = activeMarkets.length > 0 ? activeMarkets : event.markets;

  if (markets.length === 1) {
    return getMarketTokenIds(markets[0]);
  }

  const ids: string[] = [];
  for (const market of markets.slice(0, outcomeLimit)) {
    const yesId = getYesTokenId(market);
    if (yesId) ids.push(yesId);
  }
  return ids;
}

export function getAllEventTokenIds(event: Event): string[] {
  const ids = new Set<string>();
  for (const market of event.markets) {
    if (!market.active || market.closed) continue;
    for (const id of getMarketTokenIds(market)) {
      ids.add(id);
    }
  }
  return [...ids];
}
