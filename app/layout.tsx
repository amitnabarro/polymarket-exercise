import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { LivePriceProvider } from "@/components/providers/live-price-provider";
import { UrlSync } from "@/components/url-sync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polymarket | Prediction Markets",
  description: "Trade on the outcome of events. The world's largest prediction market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JotaiProvider>
          <LivePriceProvider>
            <Suspense fallback={null}>
              <UrlSync />
            </Suspense>
            <Suspense fallback={<div className="h-14 border-b border-border" />}>
              <Header />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </LivePriceProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
