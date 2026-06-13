import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import type { LivePrice, WsStatus } from "@/lib/types/websocket";

export const livePriceAtomFamily = atomFamily(() =>
  atom<LivePrice | undefined>(undefined)
);

export const wsStatusAtom = atom<WsStatus>("disconnected");

export const subscriptionRefCountsAtom = atom<Record<string, number>>({});

/** Stable string key — only changes when the subscribed ID set changes. */
export const activeAssetIdsKeyAtom = atom((get) => {
  const counts = get(subscriptionRefCountsAtom);
  return Object.keys(counts)
    .filter((id) => counts[id] > 0)
    .sort()
    .join(",");
});

export const setLivePriceAtom = atom(
  null,
  (_get, set, update: { assetId: string; price: LivePrice }) => {
    set(livePriceAtomFamily(update.assetId), update.price);
  }
);
