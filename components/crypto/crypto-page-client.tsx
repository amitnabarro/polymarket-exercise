"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import {
  cryptoEventsAtom,
  cryptoSidebarFilterAtom,
  cryptoTypeFilterAtom,
} from "@/lib/atoms/category-pages";
import type { Event } from "@/lib/types/polymarket";
import {
  CRYPTO_SIDEBAR_FILTERS,
  cryptoPageHref,
  pickCryptoCardType,
  resolveCryptoTypeFromQuery,
  type CryptoSidebarFilter,
  type CryptoTypeFilter,
} from "@/lib/utils/crypto";
import { MarketCard } from "@/components/market-card";
import { PageSkeleton } from "@/components/loading-skeleton";
import { CryptoLiveCard } from "./crypto-live-card";
import { CryptoSidebar } from "./crypto-sidebar";
import { CryptoThresholdCard } from "./crypto-threshold-card";
import { CryptoTypeFilterBar } from "./crypto-type-filter-bar";

interface CryptoPageClientProps {
  initialSidebar: CryptoSidebarFilter;
  initialType: CryptoTypeFilter;
}

function CryptoEventCard({ event }: { event: Event }) {
  const cardType = pickCryptoCardType(event);
  if (cardType === "live") return <CryptoLiveCard event={event} />;
  if (cardType === "threshold") return <CryptoThresholdCard event={event} />;
  return <MarketCard event={event} />;
}

function CryptoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useAtom(cryptoTypeFilterAtom);
  const sidebarFilter = useAtomValue(cryptoSidebarFilterAtom);
  const events = useAtomValue(cryptoEventsAtom);

  const updateTypeFilter = useCallback(
    (type: CryptoTypeFilter) => {
      setTypeFilter(type);
      const sidebarSlug =
        CRYPTO_SIDEBAR_FILTERS.find((f) => f.value === sidebarFilter)?.slug ?? "";
      const href = cryptoPageHref(sidebarSlug, type);
      router.push(href, { scroll: false });
    },
    [router, setTypeFilter, sidebarFilter]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <div className="flex gap-6 lg:gap-8">
        <CryptoSidebar value={sidebarFilter} typeFilter={typeFilter} />

        <div className="min-w-0 flex-1">
          <section className="mb-4">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Crypto</h1>
          </section>

          <CryptoTypeFilterBar value={typeFilter} onChange={updateTypeFilter} />

          {/* Mobile sidebar — horizontal scroll matching Polymarket small screens */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none md:hidden">
            {CRYPTO_SIDEBAR_FILTERS.map((option) => {
              const active = sidebarFilter === option.value;
              const href = cryptoPageHref(option.slug, typeFilter);
              return (
                <Link
                  key={option.value}
                  href={href}
                  scroll={false}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          {events.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <CryptoEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No crypto markets for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CryptoUrlSync() {
  const searchParams = useSearchParams();
  const setTypeFilter = useSetAtom(cryptoTypeFilterAtom);

  useEffect(() => {
    setTypeFilter(resolveCryptoTypeFromQuery(searchParams.get("type") ?? undefined));
  }, [searchParams, setTypeFilter]);

  return null;
}

function CryptoInit({
  initialSidebar,
  initialType,
  children,
}: {
  initialSidebar: CryptoSidebarFilter;
  initialType: CryptoTypeFilter;
  children: ReactNode;
}) {
  const setSidebarFilter = useSetAtom(cryptoSidebarFilterAtom);
  const setTypeFilter = useSetAtom(cryptoTypeFilterAtom);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setSidebarFilter(initialSidebar);
    setTypeFilter(initialType);
    setReady(true);
  }, [initialSidebar, initialType, setSidebarFilter, setTypeFilter]);

  if (!ready) return <PageSkeleton />;
  return children;
}

export function CryptoPageClient({ initialSidebar, initialType }: CryptoPageClientProps) {
  return (
    <CryptoInit initialSidebar={initialSidebar} initialType={initialType}>
      <Suspense fallback={<PageSkeleton />}>
        <CryptoUrlSync />
        <CryptoContent />
      </Suspense>
    </CryptoInit>
  );
}
