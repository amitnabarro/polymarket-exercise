"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import {
  sportsEventsAtom,
  sportsFuturesEventsAtom,
  sportsMatchupEventsAtom,
  sportsSubTagsAtom,
  sportsTagFilterAtom,
} from "@/lib/atoms/category-pages";
import type { CategorySubTag } from "@/lib/types/polymarket";
import { FilterPills } from "@/components/filter-pills";
import { CategoryFilterSidebar } from "@/components/category/category-filter-sidebar";
import { MarketCard } from "@/components/market-card";
import { PageSkeleton } from "@/components/loading-skeleton";
import { subTagsToFilterOptions } from "@/lib/utils/category-tags";
import { SportsMatchupCard } from "./sports-matchup-card";

interface SportsPageClientProps {
  subTags: CategorySubTag[];
  initialTag: string;
}

function SportsContent({ subTags }: { subTags: CategorySubTag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useAtom(sportsTagFilterAtom);
  const matchups = useAtomValue(sportsMatchupEventsAtom);
  const futures = useAtomValue(sportsFuturesEventsAtom);

  const updateFilter = useCallback(
    (slug: string) => {
      setFilter(slug);
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") params.delete("tag");
      else params.set("tag", slug);
      const qs = params.toString();
      router.push(qs ? `/sports?${qs}` : "/sports", { scroll: false });
    },
    [router, searchParams, setFilter]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <div className="flex gap-6 lg:gap-8">
        <CategoryFilterSidebar
          label="Leagues"
          subTags={subTags}
          value={filter}
          onChange={updateFilter}
        />

        <div className="min-w-0 flex-1">
          <section className="mb-5">
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Sports</h1>
              <span className="rounded-full bg-yes/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yes">
                Live
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Odds &amp; prediction markets across leagues worldwide
            </p>
          </section>

          <FilterPills
            mobileOnly
            options={subTagsToFilterOptions(subTags)}
            value={filter}
            onChange={updateFilter}
          />

          {matchups.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Live &amp; Upcoming
              </h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {matchups.map((event) => (
                  <SportsMatchupCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {futures.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Futures &amp; Predictions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {futures.map((event) => (
                  <MarketCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {matchups.length === 0 && futures.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No sports markets for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SportsUrlSync({ subTags }: { subTags: CategorySubTag[] }) {
  const searchParams = useSearchParams();
  const setFilter = useSetAtom(sportsTagFilterAtom);

  useEffect(() => {
    const tag = searchParams.get("tag");
    if (!tag || tag === "all") {
      setFilter("all");
      return;
    }
    const valid = subTags.some((t) => t.slug === tag);
    setFilter(valid ? tag : "all");
  }, [searchParams, subTags, setFilter]);

  return null;
}

function SportsInit({
  subTags,
  initialTag,
  children,
}: {
  subTags: CategorySubTag[];
  initialTag: string;
  children: ReactNode;
}) {
  const setSubTags = useSetAtom(sportsSubTagsAtom);
  const setFilter = useSetAtom(sportsTagFilterAtom);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setSubTags(subTags);
    setFilter(initialTag);
    setReady(true);
  }, [subTags, initialTag, setSubTags, setFilter]);

  if (!ready) return <PageSkeleton />;
  return children;
}

export function SportsPageClient({ subTags, initialTag }: SportsPageClientProps) {
  return (
    <SportsInit subTags={subTags} initialTag={initialTag}>
      <Suspense fallback={<PageSkeleton />}>
        <SportsUrlSync subTags={subTags} />
        <SportsContent subTags={subTags} />
      </Suspense>
    </SportsInit>
  );
}
