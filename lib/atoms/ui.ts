import { atom } from "jotai";

export type Category = "" | "crypto" | "sports" | "politics";

export type MarketSort = "trending" | "new" | "popular";

export const CATEGORIES: { label: string; value: Category }[] = [
  { label: "All", value: "" },
  { label: "Crypto", value: "crypto" },
  { label: "Sports", value: "sports" },
  { label: "Politics", value: "politics" },
];

export const searchQueryAtom = atom("");

export const activeTopicAtom = atom("");

export const categoryAtom = atom<Category>("");

export const sortOrderAtom = atom<MarketSort>("trending");
