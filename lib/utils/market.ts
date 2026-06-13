import type { Event, Market } from "@/lib/types/polymarket";
import { formatPercent, parseJsonArray } from "./format";
import { getMarketTokenIds } from "./tokens";

interface MarketOutcome {
  label: string;
  price: number;
  percent: string;
  tokenId?: string;
}

export function getMarketOutcomes(market: Market): MarketOutcome[] {
  const outcomes = parseJsonArray<string>(market.outcomes);
  const tokens = getMarketTokenIds(market);
  const prices = parseJsonArray<string>(market.outcomePrices).map(Number);
  return outcomes.map((label, i) => {
    const price = prices[i] ?? 0;
    return { label, price, percent: formatPercent(price), tokenId: tokens[i] };
  });
}

export function getTopOutcomes(event: Event, count = 2): MarketOutcome[] {
  const activeMarkets = event.markets.filter((m) => m.active && !m.closed);
  const markets = activeMarkets.length > 0 ? activeMarkets : event.markets;

  if (markets.length === 1) {
    return getMarketOutcomes(markets[0]);
  }

  return markets.slice(0, count).map((market) => {
    const outcomes = getMarketOutcomes(market);
    const yes = outcomes.find((o) => o.label === "Yes") ?? outcomes[0];
    const yesPrice = yes?.price ?? 0;
    return {
      label: market.groupItemTitle || market.question,
      price: yesPrice,
      percent: formatPercent(yesPrice),
      tokenId: yes?.tokenId,
    };
  });
}

export function isBinaryMarket(event: Event): boolean {
  return event.markets.length === 1;
}

export function getEventVolume(event: Event): number {
  return event.volume24hr || event.volume || 0;
}

export function getYesPrice(market: Market): number {
  const outcomes = getMarketOutcomes(market);
  return outcomes.find((o) => o.label === "Yes")?.price ?? outcomes[0]?.price ?? 0;
}

export function sortMarketsByProbability(markets: Market[]): Market[] {
  return [...markets].sort((a, b) => getYesPrice(b) - getYesPrice(a));
}
