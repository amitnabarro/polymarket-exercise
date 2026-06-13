"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { type SubmitEvent } from "react";
import { searchQueryAtom } from "@/lib/atoms/ui";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useAtom(searchQueryAtom);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search markets..."
          className="h-9 w-full rounded-full border border-border bg-muted/50 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
        />
      </div>
    </form>
  );
}
