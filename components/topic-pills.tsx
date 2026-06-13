"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, type Category } from "@/lib/atoms/ui";

const CATEGORY_HREFS: Partial<Record<Category, string>> = {
  crypto: "/crypto",
  sports: "/sports",
  politics: "/politics",
};

export function TopicPills() {
  const pathname = usePathname();

  function isActive(value: Category): boolean {
    const href = CATEGORY_HREFS[value];
    if (href) return pathname === href || pathname.startsWith(`${href}/`);
    return pathname === "/";
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((topic) => {
        const href = CATEGORY_HREFS[topic.value] ?? "/";
        const active = isActive(topic.value);

        return (
          <Link
            key={topic.value || "all"}
            href={href}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {topic.label}
          </Link>
        );
      })}
    </div>
  );
}
