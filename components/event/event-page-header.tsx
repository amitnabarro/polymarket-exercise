"use client";

import { memo } from "react";
import type { Event } from "@/lib/types/polymarket";
import { formatDate, formatVolume } from "@/lib/utils/format";
import { getYesPrice, sortMarketsByProbability } from "@/lib/utils/market";
import { parseMatchupEvent } from "@/lib/utils/sports";
import { getMarketTokenIds } from "@/lib/utils/tokens";
import { LiveIndicator } from "@/components/live-indicator";
import { LivePrice } from "@/components/live-price";
import { MarketImage } from "@/components/market-image";

interface EventPageHeaderProps {
  event: Event;
}

export const EventPageHeader = memo(function EventPageHeader({
  event,
}: EventPageHeaderProps) {
  const matchup = parseMatchupEvent(event);
  const activeMarkets = event.markets.filter((m) => m.active && !m.closed);
  const sorted = sortMarketsByProbability(activeMarkets);
  const topOutcomes = sorted.slice(0, 4);

  return (
    <header className="mb-6">
      <div className="flex items-start gap-4">
        <MarketImage
          src={event.image || event.icon}
          alt={event.title}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">
              {event.title}
            </h1>
            <LiveIndicator />
          </div>

          {matchup ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium">{matchup.teamA}</span>
              <span className="text-muted-foreground">vs</span>
              <span className="font-medium">{matchup.teamB}</span>
            </div>
          ) : topOutcomes.length > 1 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {topOutcomes.map((market) => {
                const label = market.groupItemTitle || market.question;
                const price = getYesPrice(market);
                const tokenId = getMarketTokenIds(market)[0];
                return (
                  <span
                    key={market.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                  >
                    {label}
                    <LivePrice
                      tokenId={tokenId}
                      fallback={price}
                      format="percent-precise"
                      className="text-primary"
                    />
                  </span>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {formatVolume(event.volume)} Vol.
            </span>
            <span>{formatVolume(event.volume24hr)} 24h</span>
            <span>Ends {formatDate(event.endDate)}</span>
            {activeMarkets.length > 1 && (
              <span>{activeMarkets.length} outcomes</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
