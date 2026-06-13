"use client";

import { memo, useMemo } from "react";
import type { Market } from "@/lib/types/polymarket";
import { formatVolume } from "@/lib/utils/format";
import { getMarketOutcomes } from "@/lib/utils/market";
import { getMarketTokenIds } from "@/lib/utils/tokens";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import { LivePrice } from "@/components/live-price";
import { MarketImage } from "@/components/market-image";

interface EventOutcomeRowProps {
  market: Market;
  variant?: "list" | "binary";
}

export const EventOutcomeRow = memo(function EventOutcomeRow({
  market,
  variant = "list",
}: EventOutcomeRowProps) {
  const tokenIds = useMemo(() => getMarketTokenIds(market), [market.id]);
  useSubscribePrices(tokenIds);

  const outcomes = getMarketOutcomes(market);
  const label = market.groupItemTitle || market.question;
  const yes = outcomes.find((o) => o.label === "Yes") ?? outcomes[0];
  const no = outcomes.find((o) => o.label === "No") ?? outcomes[1];
  const volume = formatVolume(market.volumeNum || Number(market.volume));
  const pct = Math.min(100, Math.max(0, (yes?.price ?? 0) * 100));
  const isBinary = variant === "binary" || (outcomes.length === 2 && yes?.label === "Yes");

  if (!yes) return null;

  return (
    <div className="px-4 py-4 transition-colors hover:bg-muted/20">
      <div className="mb-2 flex items-center gap-3">
        {market.icon && (
          <MarketImage src={market.icon} alt={label} size="sm" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="truncate text-sm font-semibold sm:text-base">{label}</h3>
            <LivePrice
              tokenId={yes.tokenId}
              fallback={yes.price}
              format="percent-precise"
              className="shrink-0 text-lg font-bold sm:text-xl"
            />
          </div>
          {!isBinary && (
            <p className="mt-0.5 text-xs text-muted-foreground">{volume} Vol.</p>
          )}
        </div>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {yes && no && (
        <div className="flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-yes/12 py-2.5 text-sm font-medium text-yes ring-1 ring-yes/25 transition-colors hover:bg-yes/20"
          >
            Buy Yes
            <LivePrice tokenId={yes.tokenId} fallback={yes.price} format="cents" />
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-no/12 py-2.5 text-sm font-medium text-no ring-1 ring-no/25 transition-colors hover:bg-no/20"
          >
            Buy No
            <LivePrice tokenId={no.tokenId} fallback={no.price} format="cents" />
          </button>
        </div>
      )}
    </div>
  );
});
