import { atom } from "jotai";
import {
  CRYPTO_TAG_ID,
  getCategoryEvents,
  POLITICS_TAG_ID,
  SPORTS_TAG_ID,
} from "@/lib/api/gamma";
import type { CategorySubTag } from "@/lib/types/polymarket";
import { slimEventForList } from "./events-cache";
import { resolveCategoryTagId } from "@/lib/utils/category-tags";
import {
  isAboveBelowCryptoMarket,
  isHitPriceCryptoMarket,
  isPriceRangeCryptoMarket,
  isUpDownCryptoMarket,
  matchesCryptoFilters,
  type CryptoSidebarFilter,
  type CryptoTypeFilter,
} from "@/lib/utils/crypto";
import { isSportsMatchup } from "@/lib/utils/sports";

export const cryptoTypeFilterAtom = atom<CryptoTypeFilter>("all");
export const cryptoSidebarFilterAtom = atom<CryptoSidebarFilter>("all");
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

const cryptoEventsBaseAtom = atom(async () => {
  const events = await getCategoryEvents(CRYPTO_TAG_ID, 100);
  return events.map(slimEventForList);
});

export const cryptoEventsAtom = atom(async (get) => {
  const typeFilter = get(cryptoTypeFilterAtom);
  const sidebarFilter = get(cryptoSidebarFilterAtom);
  const events = await get(cryptoEventsBaseAtom);
  return events.filter((e) => matchesCryptoFilters(e, typeFilter, sidebarFilter));
});

export const cryptoLiveEventsAtom = atom(async (get) => {
  const events = await get(cryptoEventsAtom);
  return events.filter(isUpDownCryptoMarket);
});

export const cryptoThresholdEventsAtom = atom(async (get) => {
  const events = await get(cryptoEventsAtom);
  return events.filter(
    (e) =>
      isAboveBelowCryptoMarket(e) ||
      isHitPriceCryptoMarket(e) ||
      isPriceRangeCryptoMarket(e)
  );
});

export const cryptoPredictionEventsAtom = atom(async (get) => {
  const events = await get(cryptoEventsAtom);
  return events.filter(
    (e) =>
      !isUpDownCryptoMarket(e) &&
      !isAboveBelowCryptoMarket(e) &&
      !isHitPriceCryptoMarket(e) &&
      !isPriceRangeCryptoMarket(e)
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
