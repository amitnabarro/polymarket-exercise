"use client";

import { useAtomValue } from "jotai";
import { memo } from "react";
import { livePriceAtomFamily } from "@/lib/atoms/prices";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { toImpliedPercent } from "@/lib/utils/price";

interface ImpliedProbabilityBarProps {
  tokenId?: string;
  fallback: number;
  className?: string;
}

export const ImpliedProbabilityBar = memo(function ImpliedProbabilityBar({
  tokenId,
  fallback,
  className = "h-1",
}: ImpliedProbabilityBarProps) {
  const hydrated = useHydrated();
  const live = useAtomValue(livePriceAtomFamily(tokenId ?? ""));
  const width = toImpliedPercent(
    hydrated && live?.price !== undefined ? live.price : fallback
  );

  return (
    <div className={`overflow-hidden rounded-full bg-muted ${className}`}>
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
});
