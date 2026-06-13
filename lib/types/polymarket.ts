export interface Market {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  endDate: string;
  startDate?: string;
  image?: string;
  icon?: string;
  description?: string;
  outcomes: string;
  outcomePrices: string;
  clobTokenIds?: string;
  volume: string;
  volumeNum?: number;
  volume24hr?: number;
  active: boolean;
  closed: boolean;
  groupItemTitle?: string;
  lastTradePrice?: number;
  bestBid?: number;
  bestAsk?: number;
  oneDayPriceChange?: number;
  oneWeekPriceChange?: number;
}

export interface Event {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image?: string;
  icon?: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  volume24hr: number;
  openInterest: number;
  competitive: number;
  commentCount: number;
  markets: Market[];
  tags?: Tag[];
  category?: string;
}

export interface Tag {
  id: string;
  label: string;
  slug: string;
  forceShow?: boolean;
}

export type CategorySubTag = Pick<Tag, "id" | "label" | "slug">;

export interface RelatedTagLink {
  id: string;
  tagID: number;
  relatedTagID: number;
  rank: number;
}

export interface SearchResult {
  events: Event[];
  tags?: Tag[];
}

export interface LeaderboardEntry {
  rank: string;
  proxyWallet: string;
  userName: string;
  xUsername: string;
  verifiedBadge: boolean;
  vol: number;
  pnl: number;
  profileImage: string;
}

export type SortOrder =
  | "volume24hr"
  | "volume"
  | "liquidity"
  | "competitive"
  | "end_date";

export interface EventsParams {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  featured?: boolean;
  tag_id?: string;
  order?: SortOrder;
  ascending?: boolean;
}
