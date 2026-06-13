import { atom } from "jotai";
import {
  getCategoryEvents,
  POLITICS_TAG_ID,
  searchEventsDeduped,
  SPORTS_TAG_ID,
} from "@/lib/api/gamma";
import type { CategorySubTag } from "@/lib/types/polymarket";
import { slimEventForList } from "./events-cache";
import { resolveCategoryTagId } from "@/lib/utils/category-tags";
import {
  isLiveCryptoMarket,
  isThresholdCryptoMarket,
  matchesCryptoFilter,
  type CryptoAssetFilter,
} from "@/lib/utils/crypto";
import { isSportsMatchup } from "@/lib/utils/sports";

export const cryptoAssetFilterAtom = atom<CryptoAssetFilter>("all");
export const sportsTagFilterAtom = atom("all");
export const sportsSubTagsAtom = atom<CategorySubTag[]>([]);
export const politicsTagFilterAtom = atom("all");
export const politicsSubTagsAtom = atom<CategorySubTag[]>([]);

export const politicsEventsAtom = atom(async (get) => {
  const filter = get(politicsTagFilterAtom);
  const subTags = get(politicsSubTagsAtom);
  const tagId = resolveCategoryTagId(filter, subTags, POLITICS_TAG_ID);
  const events = await getCategoryEvents(tagId, 48);
  return events.map(slimEventForList);
});

const cryptoEventsBaseAtom = atom(async () =>
  searchEventsDeduped(
    ["bitcoin", "ethereum", "crypto", "solana", "btc up or down"],
    30
  )
);

export const cryptoEventsAtom = atom(async (get) => {
  const filter = get(cryptoAssetFilterAtom);
  const events = await get(cryptoEventsBaseAtom);
  return events.filter((e) => matchesCryptoFilter(e, filter));
});

export const cryptoLiveEventsAtom = atom(async (get) => {
  const events = await get(cryptoEventsAtom);
  return events.filter(isLiveCryptoMarket);
});

export const cryptoThresholdEventsAtom = atom(async (get) => {
  const events = await get(cryptoEventsAtom);
  return events.filter(isThresholdCryptoMarket);
});

export const cryptoPredictionEventsAtom = atom(async (get) => {
  const events = await get(cryptoEventsAtom);
  return events.filter(
    (e) => !isLiveCryptoMarket(e) && !isThresholdCryptoMarket(e)
  );
});

export const sportsEventsAtom = atom(async (get) => {
  const filter = get(sportsTagFilterAtom);
  const subTags = get(sportsSubTagsAtom);
  const tagId = resolveCategoryTagId(filter, subTags, SPORTS_TAG_ID);
  const events = await getCategoryEvents(tagId, 48);
  return events.map(slimEventForList);
});

export const sportsMatchupEventsAtom = atom(async (get) => {
  const events = await get(sportsEventsAtom);
  return events.filter(isSportsMatchup);
});

export const sportsFuturesEventsAtom = atom(async (get) => {
  const events = await get(sportsEventsAtom);
  return events.filter((e) => !isSportsMatchup(e));
});
