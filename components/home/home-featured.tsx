"use client";

import { useAtomValue } from "jotai";
import { memo, Suspense } from "react";
import { featuredEventsAtom } from "@/lib/atoms/markets";
import { categoryAtom } from "@/lib/atoms/ui";
import { FeaturedCard } from "@/components/featured-card";

const HomeFeaturedContent = memo(function HomeFeaturedContent() {
  const featured = useAtomValue(featuredEventsAtom);

  if (featured.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">Featured</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((event) => (
          <FeaturedCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
});

export const HomeFeatured = memo(function HomeFeatured() {
  const category = useAtomValue(categoryAtom);
  if (category) return null;

  return (
    <Suspense fallback={null}>
      <HomeFeaturedContent />
    </Suspense>
  );
});
