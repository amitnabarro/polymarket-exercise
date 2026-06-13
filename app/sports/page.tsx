import { SportsPageClient } from "@/components/sports/sports-page-client";
import { getCategorySubTags } from "@/lib/api/gamma";

export const metadata = {
  title: "Sports | Polymarket",
  description: "Sports odds and prediction markets",
};

export const revalidate = 300;

interface SportsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function SportsPage({ searchParams }: SportsPageProps) {
  const { tag } = await searchParams;
  const subTags = await getCategorySubTags("sports");
  const initialTag =
    tag && subTags.some((t) => t.slug === tag) ? tag : "all";

  return <SportsPageClient subTags={subTags} initialTag={initialTag} />;
}
