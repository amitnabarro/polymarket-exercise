"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import type { Event } from "@/lib/types/polymarket";
import { formatVolume } from "@/lib/utils/format";
import { getEventVolume, getTopOutcomes } from "@/lib/utils/market";
import { detectCryptoAsset } from "@/lib/utils/crypto";
import { getTokenIdsForEvent } from "@/lib/utils/tokens";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import { LivePrice } from "@/components/live-price";
import { MarketImage } from "@/components/market-image";

interface CryptoThresholdCardProps {
  event: Event;
}

export const CryptoThresholdCard = memo(function CryptoThresholdCard({
  event,
}: CryptoThresholdCardProps) {
  const tokenIds = useMemo(() => getTokenIdsForEvent(event, 4), [event.id]);
  useSubscribePrices(tokenIds);

  const outcomes = getTopOutcomes(event, 4);
  const asset = detectCryptoAsset(event);
  const volume = getEventVolume(event);

  return (
    <Link
      href={`/event/${event.slug}`}
      className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="mb-3 flex items-start gap-2.5">
        <MarketImage src={event.image || event.icon} alt={asset} size="sm" />
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
            {asset}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug">{event.title}</h3>
        </div>
      </div>

      <div className="space-y-2">
        {outcomes.map((outcome) => (
          <div
            key={outcome.label}
            className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
          >
            <span className="truncate text-sm text-muted-foreground">{outcome.label}</span>
            <LivePrice
              tokenId={outcome.tokenId}
              fallback={outcome.price}
              className="text-sm font-semibold"
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">{formatVolume(volume)} Vol.</p>
    </Link>
  );
});
