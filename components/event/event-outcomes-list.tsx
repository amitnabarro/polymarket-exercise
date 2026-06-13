"use client";

import { memo, useMemo, useState } from "react";
import type { Market } from "@/lib/types/polymarket";
import { sortMarketsByProbability } from "@/lib/utils/market";
import { EventOutcomeRow } from "./event-outcome-row";

const INITIAL_VISIBLE = 24;

interface EventOutcomesListProps {
  markets: Market[];
  isBinary: boolean;
}

export const EventOutcomesList = memo(function EventOutcomesList({
  markets,
  isBinary,
}: EventOutcomesListProps) {
  const [showAll, setShowAll] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  const { active, resolved } = useMemo(() => {
    const activeMarkets = markets.filter((m) => m.active && !m.closed);
    const resolvedMarkets = markets.filter((m) => m.closed);
    return {
      active: sortMarketsByProbability(activeMarkets),
      resolved: sortMarketsByProbability(resolvedMarkets),
    };
  }, [markets]);

  const visible = showAll ? active : active.slice(0, INITIAL_VISIBLE);
  const hasMore = active.length > INITIAL_VISIBLE;

  if (isBinary && active.length === 1) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <EventOutcomeRow market={active[0]} variant="binary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="divide-y divide-border">
          {visible.map((market) => (
            <EventOutcomeRow key={market.id} market={market} />
          ))}
        </div>

        {hasMore && !showAll && (
          <div className="border-t border-border p-3">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full rounded-lg py-2 text-sm font-medium text-primary transition-colors hover:bg-muted/50"
            >
              Show all {active.length} outcomes
            </button>
          </div>
        )}
      </div>

      {resolved.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowResolved((v) => !v)}
            className="mb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {showResolved ? "Hide" : "View"} resolved ({resolved.length})
          </button>
          {showResolved && (
            <div className="overflow-hidden rounded-xl border border-border bg-card opacity-75">
              <div className="divide-y divide-border">
                {resolved.map((market) => (
                  <EventOutcomeRow key={market.id} market={market} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
