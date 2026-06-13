import type { CategorySubTag } from "@/lib/types/polymarket";

export function resolveCategoryTagId(
  filter: string,
  subTags: CategorySubTag[],
  rootTagId: string
): string {
  if (filter === "all") return rootTagId;
  return subTags.find((t) => t.slug === filter)?.id ?? rootTagId;
}

export function subTagsToFilterOptions(
  subTags: CategorySubTag[]
): { label: string; value: string }[] {
  return [
    { label: "All", value: "all" },
    ...subTags.map((tag) => ({ label: tag.label, value: tag.slug })),
  ];
}
