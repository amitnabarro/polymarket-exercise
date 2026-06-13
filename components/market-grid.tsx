"use client";

import { memo } from "react";
import type { Event } from "@/lib/types/polymarket";
import { MarketCard } from "./market-card";

interface MarketGridProps {
  events: Event[];
  title?: string;
}

export const MarketGrid = memo(function MarketGrid({ events, title }: MarketGridProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No markets found for this category.</p>
      </div>
    );
  }

  return (
    <section>
      {title && <h2 className="mb-3 text-sm font-medium text-muted-foreground">{title}</h2>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <MarketCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
});
