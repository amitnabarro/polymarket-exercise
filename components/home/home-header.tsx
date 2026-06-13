"use client";

import { useAtomValue } from "jotai";
import { memo } from "react";
import { totalVolumeAtom } from "@/lib/atoms/markets";
import { categoryAtom, sortOrderAtom } from "@/lib/atoms/ui";
import { formatVolume } from "@/lib/utils/format";

const SORT_LABELS = {
  trending: "Trending",
  new: "New",
  popular: "Popular",
} as const;

const CATEGORY_LABELS = {
  "": "All Markets",
  crypto: "Crypto Markets",
  sports: "Sports Markets",
  politics: "Politics Markets",
} as const;

export const HomeHeader = memo(function HomeHeader() {
  const totalVolume = useAtomValue(totalVolumeAtom);
  const sort = useAtomValue(sortOrderAtom);
  const category = useAtomValue(categoryAtom);

  const title = category
    ? CATEGORY_LABELS[category]
    : `${SORT_LABELS[sort]} Markets`;

  return (
    <section className="mb-6">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {formatVolume(totalVolume)} traded in the last 24 hours
      </p>
    </section>
  );
});
