import { atom } from "jotai";
import { getFeaturedEvents, searchMarkets } from "@/lib/api/gamma";
import { matchesCategory } from "@/lib/utils/category";
import { getTrendingEventsCached, slimEventForList } from "./events-cache";
import { activeTopicAtom, categoryAtom, searchQueryAtom, sortOrderAtom } from "./ui";
import type { MarketSort } from "./ui";
import type { SortOrder } from "@/lib/types/polymarket";

const SORT_TO_API: Record<MarketSort, { order: SortOrder; ascending: boolean }> = {
  trending: { order: "volume24hr", ascending: false },
  popular: { order: "volume", ascending: false },
  new: { order: "competitive", ascending: false },
};

export const featuredEventsAtom = atom(async () => {
  const events = await getFeaturedEvents(4);
  return events.map(slimEventForList);
});

const trendingEventsBaseAtom = atom(async (get) => {
  const sort = get(sortOrderAtom);
  const { order, ascending } = SORT_TO_API[sort];
  return getTrendingEventsCached(order, ascending);
});

export const trendingEventsAtom = atom(async (get) => {
  const events = await get(trendingEventsBaseAtom);
  return events.filter((event) => matchesCategory(event, get(categoryAtom)));
});

const searchResultsBaseAtom = atom(async (get) => {
  const query = get(searchQueryAtom).trim() || get(activeTopicAtom).trim();
  if (!query) return [];
  const results = await searchMarkets(query, 30);
  return (results.events ?? []).map(slimEventForList);
});

export const searchResultsAtom = atom(async (get) => {
  return get(searchResultsBaseAtom);
});

export const totalVolumeAtom = atom(async (get) => {
  const events = await get(trendingEventsAtom);
  return events.reduce((sum, e) => sum + (e.volume24hr || 0), 0);
});
