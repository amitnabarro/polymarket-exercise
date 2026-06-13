"use client";

import { useAtom, useAtomValue } from "jotai";
import { Suspense } from "react";
import {
  cryptoAssetFilterAtom,
  cryptoLiveEventsAtom,
  cryptoPredictionEventsAtom,
  cryptoThresholdEventsAtom,
} from "@/lib/atoms/category-pages";
import { CRYPTO_FILTERS } from "@/lib/utils/crypto";
import { FilterPills } from "@/components/filter-pills";
import { MarketCard } from "@/components/market-card";
import { PageSkeleton } from "@/components/loading-skeleton";
import { CryptoLiveCard } from "./crypto-live-card";
import { CryptoThresholdCard } from "./crypto-threshold-card";

function CryptoContent() {
  const [filter, setFilter] = useAtom(cryptoAssetFilterAtom);
  const live = useAtomValue(cryptoLiveEventsAtom);
  const thresholds = useAtomValue(cryptoThresholdEventsAtom);
  const predictions = useAtomValue(cryptoPredictionEventsAtom);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <section className="mb-6">
        <h1 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl">Crypto</h1>
        <p className="text-sm text-muted-foreground">
          Live price markets, thresholds, and crypto predictions
        </p>
      </section>

      <section className="mb-6">
        <FilterPills options={CRYPTO_FILTERS} value={filter} onChange={setFilter} />
      </section>

      {live.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            Live Markets
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((event) => (
              <CryptoLiveCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {thresholds.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Price Thresholds
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {thresholds.map((event) => (
              <CryptoThresholdCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {predictions.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Predictions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {predictions.map((event) => (
              <MarketCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {live.length === 0 && thresholds.length === 0 && predictions.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No crypto markets for this filter.</p>
        </div>
      )}
    </div>
  );
}

export function CryptoPageClient() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CryptoContent />
    </Suspense>
  );
}
