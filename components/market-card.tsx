"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { memo, useMemo } from "react";
import { livePriceAtomFamily } from "@/lib/atoms/prices";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import type { Event } from "@/lib/types/polymarket";
import { formatVolume } from "@/lib/utils/format";
import { getEventVolume, getTopOutcomes } from "@/lib/utils/market";
import { getTokenIdsForEvent } from "@/lib/utils/tokens";
import { MarketImage } from "./market-image";
import { OutcomeButtons } from "./outcome-buttons";

interface MarketCardProps {
  event: Event;
}

function LiveChanceBar({ tokenId, fallback }: { tokenId?: string; fallback: number }) {
  const live = useAtomValue(livePriceAtomFamily(tokenId ?? ""));
  const price = live?.price ?? fallback;
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${Math.min(100, price * 100)}%` }}
      />
    </div>
  );
}

export const MarketCard = memo(function MarketCard({ event }: MarketCardProps) {
  const tokenIds = useMemo(() => getTokenIdsForEvent(event), [event.id]);
  useSubscribePrices(tokenIds);

  const outcomes = getTopOutcomes(event, 2);
  const volume = getEventVolume(event);
  const isBinary = event.markets.length === 1;
  const topOutcome = outcomes[0];

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/40 hover:bg-card/80"
    >
      <div className="mb-3 flex items-start gap-2.5">
        <MarketImage src={event.image || event.icon} alt={event.title} size="sm" />
        <h3 className="line-clamp-2 flex-1 text-[13px] font-medium leading-snug text-foreground/90 group-hover:text-foreground">
          {event.title}
        </h3>
      </div>

      {isBinary && topOutcome ? (
        <div className="mb-2.5">
          <LiveChanceBar tokenId={topOutcome.tokenId} fallback={topOutcome.price} />
        </div>
      ) : null}

      <OutcomeButtons outcomes={outcomes} live compact />

      <div className="mt-auto flex items-center justify-between pt-2.5 text-[11px] text-muted-foreground">
        <span className="font-medium">{formatVolume(volume)} Vol.</span>
        {event.commentCount > 0 && (
          <span>{event.commentCount.toLocaleString()} comments</span>
        )}
      </div>
    </Link>
  );
});
