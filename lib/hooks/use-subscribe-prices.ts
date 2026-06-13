"use client";

import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { subscriptionRefCountsAtom } from "@/lib/atoms/prices";

export function useSubscribePrices(assetIds: string[]) {
  const setRefCounts = useSetAtom(subscriptionRefCountsAtom);

  const stableIds = useMemo(
    () => [...new Set(assetIds.filter(Boolean))].sort().join(","),
    [assetIds]
  );

  useEffect(() => {
    const ids = stableIds ? stableIds.split(",") : [];
    if (!ids.length) return;

    setRefCounts((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = (next[id] ?? 0) + 1;
      return next;
    });

    return () => {
      setRefCounts((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          if (!next[id]) continue;
          next[id] -= 1;
          if (next[id] <= 0) delete next[id];
        }
        return next;
      });
    };
  }, [stableIds, setRefCounts]);
}
