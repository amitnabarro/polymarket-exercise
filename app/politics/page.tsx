import { PoliticsPageClient } from "@/components/politics/politics-page-client";
import { getCategorySubTags } from "@/lib/api/gamma";

export const metadata = {
  title: "Politics | Polymarket",
  description: "Politics prediction markets and live odds",
};

export const revalidate = 300;

interface PoliticsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function PoliticsPage({ searchParams }: PoliticsPageProps) {
  const { tag } = await searchParams;
  const subTags = await getCategorySubTags("politics");
  const initialTag =
    tag && subTags.some((t) => t.slug === tag) ? tag : "all";

  return <PoliticsPageClient subTags={subTags} initialTag={initialTag} />;
}
