"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import type { Event } from "@/lib/types/polymarket";
import { formatCount, formatVolume } from "@/lib/utils/format";
import { getEventVolume, getTopOutcomes, isBinaryMarket } from "@/lib/utils/market";
import { getTokenIdsForEvent } from "@/lib/utils/tokens";
import { ImpliedProbabilityBar } from "./implied-probability-bar";
import { MarketImage } from "./market-image";
import { OutcomeButtons } from "./outcome-buttons";

interface MarketCardProps {
  event: Event;
}

export const MarketCard = memo(function MarketCard({ event }: MarketCardProps) {
  const tokenIds = useMemo(() => getTokenIdsForEvent(event), [event.id]);
  useSubscribePrices(tokenIds);

  const outcomes = getTopOutcomes(event, 2);
  const volume = getEventVolume(event);
  const isBinary = isBinaryMarket(event);
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
          <ImpliedProbabilityBar
            tokenId={topOutcome.tokenId}
            fallback={topOutcome.price}
          />
        </div>
      ) : null}

      <OutcomeButtons outcomes={outcomes} live compact />

      <div className="mt-auto flex items-center justify-between pt-2.5 text-[11px] text-muted-foreground">
        <span className="font-medium">{formatVolume(volume)} Vol.</span>
        {event.commentCount > 0 && (
          <span>{formatCount(event.commentCount)} comments</span>
        )}
      </div>
    </Link>
  );
});
