"use client";

import { useAtomValue } from "jotai";
import { Suspense } from "react";
import { leaderboardAtom } from "@/lib/atoms/leaderboard";
import { formatPnl, formatVolume } from "@/lib/utils/format";

function LeaderboardContent() {
  const entries = useAtomValue(leaderboardAtom);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Leaderboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Top traders by profit and loss
      </p>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Trader</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Volume</th>
              <th className="px-4 py-3 text-right font-medium">PnL</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.proxyWallet}
                className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  #{entry.rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {entry.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{entry.userName}</span>
                    {entry.verifiedBadge && (
                      <span className="text-primary" title="Verified">✓</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {formatVolume(entry.vol)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    entry.pnl >= 0 ? "text-yes" : "text-no"
                  }`}
                >
                  {formatPnl(entry.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 h-12 animate-pulse rounded-lg bg-muted" />
      <div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
    </div>
  );
}

export function LeaderboardPageClient() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  );
}
