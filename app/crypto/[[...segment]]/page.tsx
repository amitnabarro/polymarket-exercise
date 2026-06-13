import { redirect } from "next/navigation";
import { CryptoPageClient } from "@/components/crypto/crypto-page-client";
import {
  isValidCryptoSidebarSlug,
  resolveCryptoSidebarFromSlug,
  resolveCryptoTypeFromQuery,
} from "@/lib/utils/crypto";

export const metadata = {
  title: "Crypto | Polymarket",
  description: "Live crypto price markets and predictions",
};

interface CryptoPageProps {
  params: Promise<{ segment?: string[] }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function CryptoPage({ params, searchParams }: CryptoPageProps) {
  const { segment } = await params;
  const { type } = await searchParams;
  const slug = segment?.[0];

  if (slug && !isValidCryptoSidebarSlug(slug)) {
    redirect("/crypto");
  }

  return (
    <CryptoPageClient
      initialSidebar={resolveCryptoSidebarFromSlug(slug)}
      initialType={resolveCryptoTypeFromQuery(type)}
    />
  );
}
