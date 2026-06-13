import type { LivePrice, WsMessage, WsStatus } from "@/lib/types/websocket";
import { clampProbability } from "@/lib/utils/price";

const WS_URL = "wss://ws-subscriptions-clob.polymarket.com/ws/market";
const PING_INTERVAL_MS = 10_000;
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function midpoint(bid?: number, ask?: number): number | undefined {
  if (bid !== undefined && ask !== undefined) return (bid + ask) / 2;
  return bid ?? ask;
}

function priceFromBook(bids?: { price: string }[], asks?: { price: string }[]): number | undefined {
  const bestBid = bids?.length ? parsePrice(bids[0].price) : undefined;
  const bestAsk = asks?.length ? parsePrice(asks[0].price) : undefined;
  return midpoint(bestBid, bestAsk);
}

export interface MarketSocketCallbacks {
  onPriceUpdate: (assetId: string, price: LivePrice) => void;
  onStatusChange: (status: WsStatus) => void;
}

export class MarketSocket {
  private ws: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private subscribedIds = new Set<string>();
  private pendingIds = new Set<string>();
  private reconnectAttempt = 0;
  private disposed = false;

  constructor(private callbacks: MarketSocketCallbacks) {}

  syncSubscriptions(assetIds: string[]) {
    if (assetIds.length > 0) this.disposed = false;

    const next = new Set(assetIds);
    const toAdd = [...next].filter((id) => !this.subscribedIds.has(id));
    const toRemove = [...this.subscribedIds].filter((id) => !next.has(id));

    for (const id of toAdd) this.pendingIds.add(id);
    for (const id of toRemove) {
      this.subscribedIds.delete(id);
      this.pendingIds.delete(id);
      this.sendUnsubscribe([id]);
    }

    if (toAdd.length > 0) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendSubscribe(toAdd);
        toAdd.forEach((id) => {
          this.subscribedIds.add(id);
          this.pendingIds.delete(id);
        });
      } else {
        this.connect();
      }
    } else if (next.size === 0) {
      this.disconnect();
    }
  }

  disconnect() {
    this.disposed = true;
    this.clearTimers();
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.subscribedIds.clear();
    this.pendingIds.clear();
    this.callbacks.onStatusChange("disconnected");
  }

  private connect() {
    if (this.disposed) return;
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const allIds = [...new Set([...this.subscribedIds, ...this.pendingIds])];
    if (allIds.length === 0) return;

    this.callbacks.onStatusChange("connecting");
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.callbacks.onStatusChange("connected");

      this.ws?.send(
        JSON.stringify({
          type: "market",
          assets_ids: allIds,
          custom_feature_enabled: true,
        })
      );

      allIds.forEach((id) => {
        this.subscribedIds.add(id);
        this.pendingIds.delete(id);
      });

      this.pingTimer = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send("PING");
        }
      }, PING_INTERVAL_MS);
    };

    this.ws.onmessage = (event) => {
      if (event.data === "PONG") return;
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        this.handleMessage(msg);
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.clearPing();
      this.ws = null;
      if (!this.disposed && this.subscribedIds.size + this.pendingIds.size > 0) {
        this.callbacks.onStatusChange("disconnected");
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** this.reconnectAttempt,
      RECONNECT_MAX_MS
    );
    this.reconnectAttempt += 1;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      const ids = [...this.subscribedIds, ...this.pendingIds];
      this.subscribedIds.clear();
      ids.forEach((id) => this.pendingIds.add(id));
      this.connect();
    }, delay);
  }

  private clearPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private clearTimers() {
    this.clearPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private sendSubscribe(assetIds: string[]) {
    if (!assetIds.length || this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        assets_ids: assetIds,
        operation: "subscribe",
        custom_feature_enabled: true,
      })
    );
  }

  private sendUnsubscribe(assetIds: string[]) {
    if (!assetIds.length || this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        assets_ids: assetIds,
        operation: "unsubscribe",
      })
    );
  }

  private emitPrice(assetId: string, price: number, bestBid?: number, bestAsk?: number) {
    if (!assetId || !Number.isFinite(price)) return;
    this.callbacks.onPriceUpdate(assetId, {
      price: clampProbability(price),
      bestBid: bestBid !== undefined ? clampProbability(bestBid) : undefined,
      bestAsk: bestAsk !== undefined ? clampProbability(bestAsk) : undefined,
      updatedAt: Date.now(),
    });
  }

  private handleMessage(msg: WsMessage) {
    switch (msg.event_type) {
      case "best_bid_ask": {
        const assetId = msg.asset_id;
        if (!assetId) return;
        const bestBid = parsePrice(msg.best_bid);
        const bestAsk = parsePrice(msg.best_ask);
        const price = midpoint(bestBid, bestAsk);
        if (price !== undefined) this.emitPrice(assetId, price, bestBid, bestAsk);
        break;
      }
      case "price_change": {
        for (const change of msg.price_changes ?? []) {
          const bestBid = parsePrice(change.best_bid);
          const bestAsk = parsePrice(change.best_ask);
          const price =
            midpoint(bestBid, bestAsk) ?? parsePrice(change.price);
          if (price !== undefined) {
            this.emitPrice(change.asset_id, price, bestBid, bestAsk);
          }
        }
        break;
      }
      case "last_trade_price": {
        const assetId = msg.asset_id;
        const price = parsePrice(msg.price);
        if (assetId && price !== undefined) this.emitPrice(assetId, price);
        break;
      }
      case "book": {
        const assetId = msg.asset_id;
        if (!assetId) return;
        const price = priceFromBook(msg.bids, msg.asks);
        if (price !== undefined) this.emitPrice(assetId, price);
        break;
      }
    }
  }
}

let socketInstance: MarketSocket | null = null;
let latestCallbacks: MarketSocketCallbacks | null = null;

export function getMarketSocket(callbacks: MarketSocketCallbacks): MarketSocket {
  latestCallbacks = callbacks;
  if (!socketInstance) {
    socketInstance = new MarketSocket({
      onPriceUpdate: (assetId, price) =>
        latestCallbacks?.onPriceUpdate(assetId, price),
      onStatusChange: (status) => latestCallbacks?.onStatusChange(status),
    });
  }
  return socketInstance;
}

export function resetMarketSocket() {
  socketInstance?.disconnect();
  socketInstance = null;
}
