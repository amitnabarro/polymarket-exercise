"use client";

import { memo } from "react";

interface FilterPillOption<T extends string = string> {
  label: string;
  value: T;
}

interface FilterPillsProps<T extends string> {
  options: FilterPillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Hide on md+ when the same filters appear in a sidebar. */
  mobileOnly?: boolean;
  className?: string;
}

export const FilterPills = memo(function FilterPills<T extends string>({
  options,
  value,
  onChange,
  mobileOnly = false,
  className = "",
}: FilterPillsProps<T>) {
  return (
    <div
      className={[
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
        mobileOnly ? "mb-4 md:hidden" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}) as <T extends string>(props: FilterPillsProps<T>) => React.JSX.Element;
