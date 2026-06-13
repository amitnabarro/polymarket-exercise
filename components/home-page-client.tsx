"use client";

import { Suspense } from "react";
import { HomeFeatured } from "@/components/home/home-featured";
import { HomeHeader } from "@/components/home/home-header";
import { HomeTrendingGrid } from "@/components/home/home-trending-grid";
import { PageSkeleton } from "@/components/loading-skeleton";

function HomeContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      <Suspense fallback={<div className="mb-6 h-16 animate-pulse rounded-lg bg-muted" />}>
        <HomeHeader />
      </Suspense>

      <HomeFeatured />

      <Suspense fallback={<PageSkeleton />}>
        <HomeTrendingGrid />
      </Suspense>
    </div>
  );
}

export function HomePageClient() {
  return <HomeContent />;
}
