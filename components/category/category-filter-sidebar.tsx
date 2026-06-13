"use client";

import { memo } from "react";
import type { CategorySubTag } from "@/lib/types/polymarket";

interface CategoryFilterSidebarProps {
  label: string;
  subTags: CategorySubTag[];
  value: string;
  onChange: (slug: string) => void;
}

export const CategoryFilterSidebar = memo(function CategoryFilterSidebar({
  label,
  subTags,
  value,
  onChange,
}: CategoryFilterSidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav
        className="sticky top-20 rounded-xl border border-border bg-card p-3"
        aria-label={label}
      >
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <ul className="max-h-[calc(100vh-8rem)] space-y-0.5 overflow-y-auto pr-1 scrollbar-none">
          <li>
            <button
              type="button"
              onClick={() => onChange("all")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                value === "all"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All
            </button>
          </li>
          {subTags.map((tag) => (
            <li key={tag.id}>
              <button
                type="button"
                onClick={() => onChange(tag.slug)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  value === tag.slug
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tag.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
});
