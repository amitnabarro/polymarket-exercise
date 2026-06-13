"use client";

import { memo } from "react";
import { CRYPTO_TYPE_FILTERS, type CryptoTypeFilter } from "@/lib/utils/crypto";

interface CryptoTypeFilterBarProps {
  value: CryptoTypeFilter;
  onChange: (value: CryptoTypeFilter) => void;
}

export const CryptoTypeFilterBar = memo(function CryptoTypeFilterBar({
  value,
  onChange,
}: CryptoTypeFilterBarProps) {
  return (
    <div
      className="mb-5 flex flex-wrap items-center gap-1 border-b border-border pb-4"
      role="tablist"
      aria-label="Market type"
    >
      {CRYPTO_TYPE_FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            value === option.value
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});
