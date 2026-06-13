import type { Event } from "@/lib/types/polymarket";
import type { Category } from "@/lib/atoms/ui";

const CATEGORY_KEYWORDS: Record<Exclude<Category, "">, string[]> = {
  crypto: ["crypto", "bitcoin", "btc", "ethereum", "eth", "blockchain", "defi"],
  sports: ["sport", "nba", "nfl", "nhl", "mlb", "soccer", "football", "basketball", "world cup", "fifa", "ufc", "tennis", "golf"],
  politics: ["politic", "election", "president", "congress", "senate", "governor", "democrat", "republican", "parliament", "vote"],
};

export function matchesCategory(event: Event, category: Category): boolean {
  if (!category) return true;

  const keywords = CATEGORY_KEYWORDS[category];
  const haystack = [
    event.title,
    event.description,
    event.category ?? "",
    ...(event.tags?.map((t) => t.label) ?? []),
    ...event.markets.map((m) => m.question),
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((kw) => haystack.includes(kw));
}
