"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import type { Event } from "@/lib/types/polymarket";
import { formatVolume } from "@/lib/utils/format";
import { getEventVolume } from "@/lib/utils/market";
import { parseMatchupEvent } from "@/lib/utils/sports";
import { getMarketTokenIds, getTokenIdsForEvent } from "@/lib/utils/tokens";
import { useSubscribePrices } from "@/lib/hooks/use-subscribe-prices";
import { LivePrice } from "@/components/live-price";
import { MarketImage } from "@/components/market-image";

interface SportsMatchupCardProps {
  event: Event;
  league?: string;
}

function formatGameTime(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TeamOdds({
  name,
  price,
  tokenId,
  align,
}: {
  name: string;
  price: number;
  tokenId?: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex flex-1 flex-col ${align === "right" ? "items-end text-right" : ""}`}>
      <span className="mb-1 line-clamp-2 text-sm font-medium">{name}</span>
      <button
        type="button"
        className="rounded-lg bg-yes/12 px-4 py-2 text-sm font-semibold text-yes ring-1 ring-yes/20 hover:bg-yes/20"
      >
        <LivePrice tokenId={tokenId} fallback={price} className="font-semibold" />
      </button>
    </div>
  );
}

export const SportsMatchupCard = memo(function SportsMatchupCard({
  event,
  league,
}: SportsMatchupCardProps) {
  const matchup = parseMatchupEvent(event);
  const tokenIds = useMemo(() => getTokenIdsForEvent(event, 3), [event.id]);
  useSubscribePrices(tokenIds);

  if (!matchup) return null;

  const volume = getEventVolume(event);
  const teamAMarket = event.markets.find((m) => m.groupItemTitle === matchup.teamA);
  const teamBMarket = event.markets.find((m) => m.groupItemTitle === matchup.teamB);
  const drawMarket = event.markets.find((m) =>
    (m.groupItemTitle || "").toLowerCase().includes("draw")
  );

  const teamAToken = teamAMarket ? getMarketTokenIds(teamAMarket)[0] : undefined;
  const teamBToken = teamBMarket ? getMarketTokenIds(teamBMarket)[0] : undefined;
  const drawToken = drawMarket ? getMarketTokenIds(drawMarket)[0] : undefined;

  return (
    <Link
      href={`/event/${event.slug}`}
      className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          {league && <span className="font-medium uppercase tracking-wide">{league}</span>}
          {matchup.gameTime && <span>{formatGameTime(matchup.gameTime)}</span>}
        </div>
        <span>{formatVolume(volume)} Vol.</span>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <MarketImage src={event.image || event.icon} alt={event.title} size="sm" />
        <div className="flex flex-1 items-center justify-between gap-2">
          <TeamOdds
            name={matchup.teamA}
            price={matchup.teamAPrice}
            tokenId={teamAToken}
            align="left"
          />
          <span className="shrink-0 px-2 text-xs font-medium text-muted-foreground">vs</span>
          <TeamOdds
            name={matchup.teamB}
            price={matchup.teamBPrice}
            tokenId={teamBToken}
            align="right"
          />
        </div>
      </div>

      {matchup.drawPrice !== undefined && (
        <div className="flex items-center justify-center gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Draw</span>
          <button
            type="button"
            className="rounded-md bg-muted px-3 py-1 text-xs font-semibold hover:bg-muted/80"
          >
            <LivePrice
              tokenId={drawToken}
              fallback={matchup.drawPrice}
              className="text-xs font-semibold"
            />
          </button>
        </div>
      )}
    </Link>
  );
});
