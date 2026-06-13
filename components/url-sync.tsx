"use client";

import { useSetAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  activeTopicAtom,
  categoryAtom,
  searchQueryAtom,
  sortOrderAtom,
  type Category,
  type MarketSort,
} from "@/lib/atoms/ui";

const VALID_SORTS: MarketSort[] = ["trending", "new", "popular"];
const VALID_CATEGORIES: Category[] = ["", "crypto", "sports", "politics"];

export function UrlSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const setSearchQuery = useSetAtom(searchQueryAtom);
  const setActiveTopic = useSetAtom(activeTopicAtom);
  const setSortOrder = useSetAtom(sortOrderAtom);
  const setCategory = useSetAtom(categoryAtom);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const sort = searchParams.get("sort");
    const cat = searchParams.get("category") as Category | null;

    if (pathname === "/" && cat === "politics") {
      router.replace("/politics");
      return;
    }

    if (pathname === "/search" || q) {
      setSearchQuery(q);
      setActiveTopic(q);
    } else if (pathname === "/") {
      setSearchQuery("");
      setActiveTopic("");
      setCategory(cat && VALID_CATEGORIES.includes(cat) ? cat : "");
    }

    if (sort && VALID_SORTS.includes(sort as MarketSort)) {
      setSortOrder(sort as MarketSort);
    }
  }, [searchParams, pathname, router, setSearchQuery, setActiveTopic, setSortOrder, setCategory]);

  return null;
}
