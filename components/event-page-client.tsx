"use client";

import { useMemo } from "react";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import type { Event } from "@/lib/types/polymarket";
import { formatVolume } from "@/lib/utils/format";
import { isBinaryMarket } from "@/lib/utils/market";
import { getAllEventTokenIds } from "@/lib/utils/tokens";
import { EventOutcomesList } from "./event/event-outcomes-list";
import { EventPageHeader } from "./event/event-page-header";

interface EventPageClientProps {
  event: Event;
}

export function EventPageClient({ event }: EventPageClientProps) {
  const tokenIds = useMemo(() => getAllEventTokenIds(event), [event.id]);
  useSubscribePrices(tokenIds);

  const isBinary = isBinaryMarket(event);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <div>
          <EventPageHeader event={event} />
          <EventOutcomesList markets={event.markets} isBinary={isBinary} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {event.description && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                About
              </h2>
              <p className="text-sm leading-relaxed text-foreground/85 line-clamp-[12]">
                {event.description}
              </p>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Market stats
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Liquidity</dt>
                <dd className="font-medium">{formatVolume(event.liquidity)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Open interest</dt>
                <dd className="font-medium">{formatVolume(event.openInterest)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Comments</dt>
                <dd className="font-medium">{event.commentCount.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
