import type { Event } from "@/lib/types/polymarket";
import { matchesCategory } from "./category";

/** Horizontal market-type tabs (Polymarket top bar). */
export type CryptoTypeFilter =
  | "all"
  | "up-down"
  | "above-below"
  | "price-range"
  | "hit-price";

export const CRYPTO_TYPE_FILTERS: { label: string; value: CryptoTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Up / Down", value: "up-down" },
  { label: "Above / Below", value: "above-below" },
  { label: "Price Range", value: "price-range" },
  { label: "Hit Price", value: "hit-price" },
];

/** Left sidebar routes — matches polymarket.com/crypto/{segment}. */
export type CryptoSidebarFilter =
  | "all"
  | "5M"
  | "15M"
  | "hourly"
  | "4hour"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "pre-market"
  | "bitcoin"
  | "ethereum"
  | "solana"
  | "xrp"
  | "dogecoin"
  | "bnb"
  | "etf"
  | "microstrategy";

export interface CryptoSidebarOption {
  label: string;
  value: CryptoSidebarFilter;
  /** URL segment under /crypto — empty string for /crypto */
  slug: string;
}

export const CRYPTO_SIDEBAR_FILTERS: CryptoSidebarOption[] = [
  { label: "All", value: "all", slug: "" },
  { label: "5 Min", value: "5M", slug: "5M" },
  { label: "15 Min", value: "15M", slug: "15M" },
  { label: "1 Hour", value: "hourly", slug: "hourly" },
  { label: "4 Hours", value: "4hour", slug: "4hour" },
  { label: "Daily", value: "daily", slug: "daily" },
  { label: "Weekly", value: "weekly", slug: "weekly" },
  { label: "Monthly", value: "monthly", slug: "monthly" },
  { label: "Yearly", value: "yearly", slug: "yearly" },
  { label: "Pre-Market", value: "pre-market", slug: "pre-market" },
  { label: "Bitcoin", value: "bitcoin", slug: "bitcoin" },
  { label: "Ethereum", value: "ethereum", slug: "ethereum" },
  { label: "Solana", value: "solana", slug: "solana" },
  { label: "XRP", value: "xrp", slug: "xrp" },
  { label: "Dogecoin", value: "dogecoin", slug: "dogecoin" },
  { label: "BNB", value: "bnb", slug: "bnb" },
  { label: "ETF", value: "etf", slug: "etf" },
  { label: "Microstrategy", value: "microstrategy", slug: "microstrategy" },
];

const SIDEBAR_SLUGS = new Set(CRYPTO_SIDEBAR_FILTERS.map((f) => f.slug).filter(Boolean));

export function resolveCryptoSidebarFromSlug(slug?: string): CryptoSidebarFilter {
  if (!slug) return "all";
  const match = CRYPTO_SIDEBAR_FILTERS.find((f) => f.slug === slug);
  return match?.value ?? "all";
}

export function isValidCryptoSidebarSlug(slug?: string): boolean {
  if (!slug) return true;
  return SIDEBAR_SLUGS.has(slug);
}

export function resolveCryptoTypeFromQuery(type?: string): CryptoTypeFilter {
  if (!type) return "all";
  return CRYPTO_TYPE_FILTERS.some((f) => f.value === type)
    ? (type as CryptoTypeFilter)
    : "all";
}

export function cryptoPageHref(
  sidebarSlug: string,
  typeFilter: CryptoTypeFilter = "all"
): string {
  const base = sidebarSlug ? `/crypto/${sidebarSlug}` : "/crypto";
  if (typeFilter === "all") return base;
  return `${base}?type=${typeFilter}`;
}

function eventHaystack(event: Event): string {
  return `${event.title} ${event.slug}`.toLowerCase();
}

function parseEtWindowMinutes(title: string): number | null {
  const match = title.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );
  if (!match) return null;

  const toMinutes = (h: number, m: number, ap: string) => {
    let hour = h % 12;
    if (ap.toUpperCase() === "PM") hour += 12;
    return hour * 60 + m;
  };

  const start = toMinutes(Number(match[1]), Number(match[2]), match[3]);
  let end = toMinutes(Number(match[4]), Number(match[5]), match[6]);
  if (end < start) end += 24 * 60;
  return end - start;
}

export function isUpDownCryptoMarket(event: Event): boolean {
  const title = event.title.toLowerCase();
  return (
    title.includes("up or down") ||
    title.includes("up/down") ||
    /updown-/.test(event.slug)
  );
}

export function isAboveBelowCryptoMarket(event: Event): boolean {
  const title = event.title.toLowerCase();
  return (title.includes("above") || title.includes("below")) && !title.includes("hit");
}

export function isHitPriceCryptoMarket(event: Event): boolean {
  return event.title.toLowerCase().includes("hit");
}

export function isPriceRangeCryptoMarket(event: Event): boolean {
  const title = event.title.toLowerCase();
  return /\b\w+ \d+-\d+\b/.test(event.title) || title.includes("price range");
}

export function matchesCryptoTypeFilter(event: Event, filter: CryptoTypeFilter): boolean {
  if (filter === "all") return true;
  switch (filter) {
    case "up-down":
      return isUpDownCryptoMarket(event);
    case "above-below":
      return isAboveBelowCryptoMarket(event);
    case "price-range":
      return isPriceRangeCryptoMarket(event);
    case "hit-price":
      return isHitPriceCryptoMarket(event);
  }
}

export function matchesCryptoSidebarFilter(
  event: Event,
  filter: CryptoSidebarFilter
): boolean {
  if (filter === "all") return true;

  const haystack = eventHaystack(event);
  const title = event.title.toLowerCase();
  const slug = event.slug.toLowerCase();
  const windowMins = parseEtWindowMinutes(event.title);

  switch (filter) {
    case "5M":
      return (
        slug.includes("updown-5m") ||
        /\b5m\b/.test(haystack) ||
        (title.includes("up or down") && windowMins === 5)
      );
    case "15M":
      return (
        slug.includes("updown-15m") ||
        /\b15m\b/.test(haystack) ||
        (title.includes("up or down") && windowMins === 15)
      );
    case "hourly":
      return (
        slug.includes("hourly") ||
        slug.includes("updown-1h") ||
        (title.includes("up or down") &&
          !slug.includes("updown-5m") &&
          !slug.includes("updown-15m") &&
          (windowMins === 60 || /\b\d{1,2}(am|pm) et\b/i.test(event.title)))
      );
    case "4hour":
      return (
        slug.includes("4hour") ||
        /\b4h\b|4 hour|4:00pm-8:00pm/i.test(haystack) ||
        windowMins === 240
      );
    case "daily":
      return slug.includes("daily") || /\bdaily\b/.test(haystack) || /on [a-z]+ \d+\?/i.test(title);
    case "weekly":
      return slug.includes("weekly") || /\bweekly\b/.test(haystack) || /\b\w+ \d+-\d+\b/.test(event.title);
    case "monthly":
      return (
        slug.includes("monthly") ||
        /\bmonthly\b/.test(haystack) ||
        /\bin (january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(
          title
        )
      );
    case "yearly":
      return (
        slug.includes("yearly") ||
        /\byearly\b/.test(haystack) ||
        /\bby (december|june|march)\b/i.test(title) ||
        /\b20\d{2}\b/.test(title)
      );
    case "pre-market":
      return (
        slug.includes("pre-market") ||
        /pre-market|premarket|fdv|launch|token by|ipo|airdrop/i.test(haystack)
      );
    case "bitcoin":
      return /\bbitcoin\b|\bbtc\b/.test(haystack);
    case "ethereum":
      return /\bethereum\b|\beth\b/.test(haystack);
    case "solana":
      return /\bsolana\b|\bsol\b/.test(haystack);
    case "xrp":
      return /\bxrp\b|\bripple\b/.test(haystack);
    case "dogecoin":
      return /\bdogecoin\b|\bdoge\b/.test(haystack);
    case "bnb":
      return /\bbnb\b|binance coin/.test(haystack);
    case "etf":
      return /\betf\b/.test(haystack);
    case "microstrategy":
      return /microstrategy|micro strategy|\bmstr\b/.test(haystack);
  }
}

export function matchesCryptoFilters(
  event: Event,
  typeFilter: CryptoTypeFilter,
  sidebarFilter: CryptoSidebarFilter
): boolean {
  if (!matchesCategory(event, "crypto")) return false;
  return (
    matchesCryptoTypeFilter(event, typeFilter) &&
    matchesCryptoSidebarFilter(event, sidebarFilter)
  );
}

export function detectCryptoAsset(event: Event): string {
  const text = event.title.toLowerCase();
  if (text.includes("bitcoin") || text.includes("btc")) return "Bitcoin";
  if (text.includes("ethereum") || text.includes("eth")) return "Ethereum";
  if (text.includes("solana") || text.includes("sol")) return "Solana";
  if (text.includes("xrp")) return "XRP";
  return "Crypto";
}

export function pickCryptoCardType(
  event: Event
): "live" | "threshold" | "default" {
  if (isUpDownCryptoMarket(event)) return "live";
  if (
    isAboveBelowCryptoMarket(event) ||
    isHitPriceCryptoMarket(event) ||
    isPriceRangeCryptoMarket(event)
  ) {
    return "threshold";
  }
  return "default";
}
