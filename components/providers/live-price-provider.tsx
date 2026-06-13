"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, type ReactNode } from "react";
import { activeAssetIdsKeyAtom, setLivePriceAtom, wsStatusAtom } from "@/lib/atoms/prices";
import { getMarketSocket } from "@/lib/ws/market-socket";

export function LivePriceProvider({ children }: { children: ReactNode }) {
  const assetIdsKey = useAtomValue(activeAssetIdsKeyAtom);
  const setLivePrice = useSetAtom(setLivePriceAtom);
  const setWsStatus = useSetAtom(wsStatusAtom);
  const socketRef = useRef<ReturnType<typeof getMarketSocket> | null>(null);
  const prevKeyRef = useRef("");

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = getMarketSocket({
        onPriceUpdate: (assetId, price) => {
          setLivePrice({ assetId, price });
        },
        onStatusChange: setWsStatus,
      });
    }

    if (prevKeyRef.current === assetIdsKey) return;
    prevKeyRef.current = assetIdsKey;

    const ids = assetIdsKey ? assetIdsKey.split(",") : [];
    socketRef.current.syncSubscriptions(ids);
  }, [assetIdsKey, setLivePrice, setWsStatus]);

  return children;
}
