import type {
  CategorySubTag,
  Event,
  EventsParams,
  LeaderboardEntry,
  RelatedTagLink,
  SearchResult,
  SortOrder,
  Tag,
} from "@/lib/types/polymarket";

const GAMMA_API = "https://gamma-api.polymarket.com";
const DATA_API = "https://data-api.polymarket.com";

async function fetchApi<T>(url: string, revalidate = 60): Promise<T> {
  const res = await fetch(url, {
    next: revalidate > 0 ? { revalidate } : undefined,
    cache: revalidate > 0 ? "default" : "no-store",
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function buildParams(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function getEvents(params: EventsParams = {}): Promise<Event[]> {
  const qs = buildParams({
    limit: params.limit ?? 24,
    offset: params.offset ?? 0,
    active: params.active ?? true,
    closed: params.closed ?? false,
    featured: params.featured,
    tag_id: params.tag_id,
    order: params.order ?? "volume24hr",
    ascending: params.ascending ?? false,
  });
  return fetchApi<Event[]>(`${GAMMA_API}/events${qs}`, 0);
}

export async function getFeaturedEvents(limit = 6): Promise<Event[]> {
  return getEvents({ featured: true, limit, active: true, closed: false });
}

export async function getTrendingEvents(
  limit = 24,
  order: SortOrder = "volume24hr",
  ascending = false
): Promise<Event[]> {
  return getEvents({ limit, order, ascending });
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    return await fetchApi<Event>(`${GAMMA_API}/events/slug/${slug}`);
  } catch {
    return null;
  }
}

async function getTagById(id: string | number): Promise<Tag> {
  return fetchApi<Tag>(`${GAMMA_API}/tags/${id}`, 300);
}

async function getRelatedTags(slug: string): Promise<RelatedTagLink[]> {
  return fetchApi<RelatedTagLink[]>(
    `${GAMMA_API}/tags/slug/${slug}/related-tags`,
    300
  );
}

export const POLITICS_TAG_ID = "2";
export const SPORTS_TAG_ID = "1";
export const CRYPTO_TAG_ID = "21";

export async function getCategorySubTags(
  categorySlug: string
): Promise<CategorySubTag[]> {
  const related = await getRelatedTags(categorySlug);
  const tags = await Promise.all(
    related
      .sort((a, b) => a.rank - b.rank)
      .map(async (link) => {
        const tag = await getTagById(link.relatedTagID);
        return {
          id: String(tag.id),
          label: tag.label ?? "",
          slug: tag.slug ?? "",
        };
      })
  );
  return tags.filter((t) => t.label && t.slug);
}

export async function getCategoryEvents(
  tagId: string,
  limit = 48
): Promise<Event[]> {
  return getEvents({
    tag_id: tagId,
    limit,
    active: true,
    closed: false,
    order: "volume24hr",
    ascending: false,
  });
}

export async function searchMarkets(query: string, limit = 20): Promise<SearchResult> {
  const qs = buildParams({ q: query, limit });
  return fetchApi<SearchResult>(`${GAMMA_API}/public-search${qs}`);
}

export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  return fetchApi<LeaderboardEntry[]>(
    `${DATA_API}/v1/leaderboard${buildParams({ limit })}`
  );
}

export async function searchEventsDeduped(
  queries: string[],
  limitPerQuery = 25
): Promise<Event[]> {
  const results = await Promise.all(
    queries.map((q) => searchMarkets(q, limitPerQuery))
  );
  const seen = new Set<string>();
  const events: Event[] = [];
  for (const result of results) {
    for (const event of result.events ?? []) {
      if (!seen.has(event.id)) {
        seen.add(event.id);
        events.push(event);
      }
    }
  }
  return events.sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0));
}
