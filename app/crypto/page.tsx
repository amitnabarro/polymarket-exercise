import { CryptoPageClient } from "@/components/crypto/crypto-page-client";

export const metadata = {
  title: "Crypto | Polymarket",
  description: "Live crypto price markets and predictions",
};

export default function CryptoPage() {
  return <CryptoPageClient />;
}
