"use client";

import { useAtomValue } from "jotai";
import { Suspense } from "react";
import { searchResultsAtom } from "@/lib/atoms/markets";
import { searchQueryAtom } from "@/lib/atoms/ui";
import { MarketGrid } from "./market-grid";
import { MarketGridSkeleton } from "./loading-skeleton";
import { TopicPills } from "./topic-pills";

function SearchContent() {
  const query = useAtomValue(searchQueryAtom);
  const events = useAtomValue(searchResultsAtom);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <section className="mb-6">
        <h1 className="mb-1 text-2xl font-bold">
          {query ? `Results for "${query}"` : "Search Markets"}
        </h1>
        {query && (
          <p className="text-sm text-muted-foreground">
            {events.length} market{events.length !== 1 ? "s" : ""} found
          </p>
        )}
      </section>

      <section className="mb-6">
        <TopicPills />
      </section>

      {query ? (
        <MarketGrid events={events} />
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Enter a search term to find prediction markets.
          </p>
        </div>
      )}
    </div>
  );
}

export function SearchPageClient() {
  return (
    <Suspense fallback={<MarketGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
