"use client";

import { useAtomValue } from "jotai";
import { memo } from "react";
import { trendingEventsAtom } from "@/lib/atoms/markets";
import { MarketGrid } from "@/components/market-grid";

export const HomeTrendingGrid = memo(function HomeTrendingGrid() {
  const trending = useAtomValue(trendingEventsAtom);
  return <MarketGrid events={trending} />;
});
