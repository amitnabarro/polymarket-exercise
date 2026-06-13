import { notFound } from "next/navigation";
import { EventPageClient } from "@/components/event-page-client";
import { getEventBySlug } from "@/lib/api/gamma";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventPageClient event={event} />;
}
