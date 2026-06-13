"use client";

import { useAtomValue } from "jotai";
import { memo, useEffect, useRef } from "react";
import { livePriceAtomFamily } from "@/lib/atoms/prices";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { formatCents, formatPercent, formatPercentPrecise } from "@/lib/utils/format";

type PriceFormat = "percent" | "percent-precise" | "cents";

interface LivePriceProps {
  tokenId?: string;
  fallback: number;
  className?: string;
  animate?: boolean;
  format?: PriceFormat;
}

function formatPrice(price: number, format: PriceFormat): string {
  switch (format) {
    case "cents":
      return formatCents(price);
    case "percent-precise":
      return formatPercentPrecise(price);
    default:
      return formatPercent(price);
  }
}

export const LivePrice = memo(function LivePrice({
  tokenId,
  fallback,
  className = "",
  animate = true,
  format = "percent",
}: LivePriceProps) {
  const hydrated = useHydrated();
  const live = useAtomValue(livePriceAtomFamily(tokenId ?? ""));
  const price = hydrated && live?.price !== undefined ? live.price : fallback;
  const ref = useRef<HTMLSpanElement>(null);
  const prevPrice = useRef(price);

  useEffect(() => {
    if (!animate || price === prevPrice.current) return;
    const el = ref.current;
    if (!el || (prevPrice.current === fallback && live === undefined)) {
      prevPrice.current = price;
      return;
    }

    el.classList.remove("price-flash-up", "price-flash-down");
    void el.offsetWidth;
    el.classList.add(price > prevPrice.current ? "price-flash-up" : "price-flash-down");
    prevPrice.current = price;
  }, [price, animate, fallback, live]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatPrice(price, format)}
    </span>
  );
});
