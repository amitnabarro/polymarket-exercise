"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import type { Event } from "@/lib/types/polymarket";
import { formatDate, formatVolume } from "@/lib/utils/format";
import { getEventVolume, getTopOutcomes } from "@/lib/utils/market";
import { getTokenIdsForEvent } from "@/lib/utils/tokens";
import { MarketImage } from "./market-image";
import { OutcomeButtons } from "./outcome-buttons";

interface FeaturedCardProps {
  event: Event;
}

export const FeaturedCard = memo(function FeaturedCard({ event }: FeaturedCardProps) {
  const tokenIds = useMemo(() => getTokenIdsForEvent(event, 4), [event.id]);
  useSubscribePrices(tokenIds);

  const outcomes = getTopOutcomes(event, 4);
  const volume = getEventVolume(event);

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40"
    >
      <div className="mb-3 flex items-start gap-3">
        <MarketImage src={event.image || event.icon} alt={event.title} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
            {event.title}
          </h3>
          {event.category && (
            <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              {event.category}
            </p>
          )}
        </div>
      </div>

      <OutcomeButtons outcomes={outcomes} live />

      <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-muted-foreground">
        <span className="font-medium">{formatVolume(volume)} Vol.</span>
        <span>Ends {formatDate(event.endDate)}</span>
      </div>
    </Link>
  );
});
