"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import {
  politicsEventsAtom,
  politicsSubTagsAtom,
  politicsTagFilterAtom,
} from "@/lib/atoms/category-pages";
import type { CategorySubTag } from "@/lib/types/polymarket";
import { FilterPills } from "@/components/filter-pills";
import { CategoryFilterSidebar } from "@/components/category/category-filter-sidebar";
import { MarketGrid } from "@/components/market-grid";
import { PageSkeleton } from "@/components/loading-skeleton";
import { subTagsToFilterOptions } from "@/lib/utils/category-tags";

interface PoliticsPageClientProps {
  subTags: CategorySubTag[];
  initialTag: string;
}

function PoliticsContent({ subTags }: { subTags: CategorySubTag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useAtom(politicsTagFilterAtom);
  const events = useAtomValue(politicsEventsAtom);

  const updateFilter = useCallback(
    (slug: string) => {
      setFilter(slug);
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") params.delete("tag");
      else params.set("tag", slug);
      const qs = params.toString();
      router.push(qs ? `/politics?${qs}` : "/politics", { scroll: false });
    },
    [router, searchParams, setFilter]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <div className="flex gap-6 lg:gap-8">
        <CategoryFilterSidebar
          label="Topics"
          subTags={subTags}
          value={filter}
          onChange={updateFilter}
        />

        <div className="min-w-0 flex-1">
          <section className="mb-5">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Politics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Prediction markets on elections, policy, and geopolitics
            </p>
          </section>

          <FilterPills
            mobileOnly
            options={subTagsToFilterOptions(subTags)}
            value={filter}
            onChange={updateFilter}
          />

          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-medium text-muted-foreground">
              24hr Volume
            </span>
            <span className="text-xs font-medium text-muted-foreground">Active</span>
          </div>

          <MarketGrid events={events} />
        </div>
      </div>
    </div>
  );
}

function PoliticsUrlSync({ subTags }: { subTags: CategorySubTag[] }) {
  const searchParams = useSearchParams();
  const setFilter = useSetAtom(politicsTagFilterAtom);

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

function PoliticsInit({
  subTags,
  initialTag,
  children,
}: {
  subTags: CategorySubTag[];
  initialTag: string;
  children: ReactNode;
}) {
  const setSubTags = useSetAtom(politicsSubTagsAtom);
  const setFilter = useSetAtom(politicsTagFilterAtom);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setSubTags(subTags);
    setFilter(initialTag);
    setReady(true);
  }, [subTags, initialTag, setSubTags, setFilter]);

  if (!ready) return <PageSkeleton />;
  return children;
}

export function PoliticsPageClient({ subTags, initialTag }: PoliticsPageClientProps) {
  return (
    <PoliticsInit subTags={subTags} initialTag={initialTag}>
      <Suspense fallback={<PageSkeleton />}>
        <PoliticsUrlSync subTags={subTags} />
        <PoliticsContent subTags={subTags} />
      </Suspense>
    </PoliticsInit>
  );
}
