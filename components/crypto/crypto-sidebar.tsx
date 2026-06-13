"use client";

import Link from "next/link";
import { memo } from "react";
import {
  CRYPTO_SIDEBAR_FILTERS,
  cryptoPageHref,
  type CryptoSidebarFilter,
  type CryptoTypeFilter,
} from "@/lib/utils/crypto";

interface CryptoSidebarProps {
  value: CryptoSidebarFilter;
  typeFilter: CryptoTypeFilter;
}

export const CryptoSidebar = memo(function CryptoSidebar({
  value,
  typeFilter,
}: CryptoSidebarProps) {
  return (
    <aside className="hidden w-52 shrink-0 md:block">
      <nav
        className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 scrollbar-none"
        aria-label="Crypto filters"
      >
        <ul className="space-y-0.5">
          {CRYPTO_SIDEBAR_FILTERS.map((option) => {
            const active = value === option.value;
            const href = cryptoPageHref(option.slug, typeFilter);

            return (
              <li key={option.value}>
                <Link
                  href={href}
                  scroll={false}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
});
