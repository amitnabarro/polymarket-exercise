export type WsEventType =
  | "book"
  | "price_change"
  | "last_trade_price"
  | "best_bid_ask"
  | "tick_size_change"
  | "new_market"
  | "market_resolved";

export interface PriceChange {
  asset_id: string;
  price: string;
  size: string;
  side: string;
  best_bid: string;
  best_ask: string;
}

export interface WsMessage {
  event_type: WsEventType;
  asset_id?: string;
  market?: string;
  price?: string;
  side?: string;
  size?: string;
  best_bid?: string;
  best_ask?: string;
  spread?: string;
  price_changes?: PriceChange[];
  bids?: { price: string; size: string }[];
  asks?: { price: string; size: string }[];
  timestamp?: string;
}

export type WsStatus = "connecting" | "connected" | "disconnected";

export interface LivePrice {
  price: number;
  bestBid?: number;
  bestAsk?: number;
  updatedAt: number;
}
