"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { categoryAtom, sortOrderAtom, type Category, type MarketSort } from "@/lib/atoms/ui";
import { LiveIndicator } from "./live-indicator";
import { SearchBar } from "./search-bar";

const CATEGORY_LINKS: { label: string; value: Category; href?: string }[] = [
  { label: "Crypto", value: "crypto", href: "/crypto" },
  { label: "Sports", value: "sports", href: "/sports" },
  { label: "Politics", value: "politics", href: "/politics" },
];

const SORT_ITEMS: { label: string; sort: MarketSort }[] = [
  { label: "Trending", sort: "trending" },
  { label: "New", sort: "new" },
  { label: "Popular", sort: "popular" },
];

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = useAtomValue(sortOrderAtom);
  const category = useAtomValue(categoryAtom);

  function isCategoryActive(value: Category, href?: string) {
    if (href) return pathname === href || pathname.startsWith(`${href}/`);
    return pathname === "/" && category === value;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="hidden text-lg font-semibold tracking-tight sm:block">
              Polymarket
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {CATEGORY_LINKS.map((item) => (
              <Link
                key={item.value}
                href={item.href ?? "/"}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isCategoryActive(item.value, item.href)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
            <LiveIndicator />
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto border-t border-border/60 py-2 scrollbar-none lg:hidden">
          <Link
            href="/"
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              pathname === "/" && !category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </Link>
          {CATEGORY_LINKS.map((item) => (
            <Link
              key={item.value}
              href={item.href ?? "/"}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                isCategoryActive(item.value, item.href)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {pathname === "/" && (
          <div className="hidden items-center gap-1 border-t border-border/60 py-2 lg:flex">
            {SORT_ITEMS.map((item) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("sort", item.sort);
              const href = `/?${params.toString()}`;
              const isActive = activeSort === item.sort;

              return (
                <Link
                  key={item.sort}
                  href={href}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <span className="mx-1 text-border">|</span>
            <Link
              href="/leaderboard"
              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Leaderboard
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
