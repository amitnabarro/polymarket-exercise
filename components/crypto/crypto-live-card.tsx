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

interface CryptoLiveCardProps {
  event: Event;
}

export const CryptoLiveCard = memo(function CryptoLiveCard({ event }: CryptoLiveCardProps) {
  const tokenIds = useMemo(() => getTokenIdsForEvent(event), [event.id]);
  useSubscribePrices(tokenIds);

  const outcomes = getTopOutcomes(event, 2);
  const up = outcomes.find((o) => o.label.toLowerCase().includes("up")) ?? outcomes[0];
  const down = outcomes.find((o) => o.label.toLowerCase().includes("down")) ?? outcomes[1];
  const asset = detectCryptoAsset(event);
  const volume = getEventVolume(event);

  return (
    <Link
      href={`/event/${event.slug}`}
      className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-card to-amber-950/20 p-4 transition-colors hover:border-amber-500/50"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <MarketImage src={event.image || event.icon} alt={asset} size="sm" />
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Live
            </span>
            <p className="mt-1 text-sm font-medium leading-snug">{event.title}</p>
          </div>
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground">{formatVolume(volume)}</span>
      </div>

      {up && down ? (
        <div className="grid grid-cols-2 gap-2">
          <span className="flex flex-col items-center rounded-lg bg-yes/12 py-3 ring-1 ring-yes/25">
            <span className="text-xs text-yes/80">Up</span>
            <LivePrice tokenId={up.tokenId} fallback={up.price} className="text-lg font-bold text-yes" />
          </span>
          <span className="flex flex-col items-center rounded-lg bg-no/12 py-3 ring-1 ring-no/25">
            <span className="text-xs text-no/80">Down</span>
            <LivePrice tokenId={down.tokenId} fallback={down.price} className="text-lg font-bold text-no" />
          </span>
        </div>
      ) : null}
    </Link>
  );
});
