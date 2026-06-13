import { atom, getDefaultStore } from "jotai";
import { getTrendingEvents } from "@/lib/api/gamma";
import type { Event, SortOrder } from "@/lib/types/polymarket";

const TRENDING_CACHE_TTL_MS = 60_000;

interface CacheEntry {
  data: Event[];
  fetchedAt: number;
}

/** Jotai-backed write-through cache for trending events (client session). */
const trendingEventsCacheAtom = atom<Record<string, CacheEntry>>({});

function cacheKey(order: SortOrder, ascending: boolean, limit: number): string {
  return `${order}:${ascending}:${limit}`;
}

/** Strip fields not needed for list/card views to reduce memory footprint. */
export function slimEventForList(event: Event): Event {
  return {
    ...event,
    description: "",
    markets: event.markets.map((m) => ({
      id: m.id,
      question: m.question,
      conditionId: m.conditionId,
      slug: m.slug,
      endDate: m.endDate,
      image: m.image,
      icon: m.icon,
      outcomes: m.outcomes,
      outcomePrices: m.outcomePrices,
      clobTokenIds: m.clobTokenIds,
      volume: m.volume,
      volumeNum: m.volumeNum,
      active: m.active,
      closed: m.closed,
      groupItemTitle: m.groupItemTitle,
    })),
  };
}

export async function getTrendingEventsCached(
  order: SortOrder,
  ascending: boolean,
  limit = 24
): Promise<Event[]> {
  const key = cacheKey(order, ascending, limit);
  const store = getDefaultStore();
  const cache = store.get(trendingEventsCacheAtom);
  const hit = cache[key];

  if (hit && Date.now() - hit.fetchedAt < TRENDING_CACHE_TTL_MS) {
    return hit.data;
  }

  const raw = await getTrendingEvents(limit, order, ascending);
  const data = raw.map(slimEventForList);

  store.set(trendingEventsCacheAtom, (prev) => ({
    ...prev,
    [key]: { data, fetchedAt: Date.now() },
  }));

  return data;
}
