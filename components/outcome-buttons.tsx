"use client";

import { memo } from "react";
import { formatPercent } from "@/lib/utils/format";
import { LivePrice } from "./live-price";
import { ImpliedProbabilityBar } from "./implied-probability-bar";

interface Outcome {
  label: string;
  percent: string;
  price: number;
  tokenId?: string;
  noPrice?: number;
  noTokenId?: string;
}

interface OutcomeButtonsProps {
  outcomes: Outcome[];
  compact?: boolean;
  live?: boolean;
}

const oddsChipClass =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-yes/12 px-3 py-2 text-sm font-medium text-yes ring-1 ring-yes/20";
const oddsChipNoClass =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-no/12 px-3 py-2 text-sm font-medium text-no ring-1 ring-no/20";
const oddsChipCompactYesClass =
  "inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-yes/12 px-2 py-1 text-xs font-medium text-yes ring-1 ring-yes/20";
const oddsChipCompactNoClass =
  "inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-no/12 px-2 py-1 text-xs font-medium text-no ring-1 ring-no/20";

export const OutcomeButtons = memo(function OutcomeButtons({
  outcomes,
  compact,
  live,
}: OutcomeButtonsProps) {
  if (outcomes.length === 0) return null;

  const isBinaryYesNo =
    outcomes.length === 2 && outcomes[0].label === "Yes" && outcomes[1].label === "No";

  if (isBinaryYesNo) {
    return (
      <div className={`flex gap-2 ${compact ? "" : "mt-3"}`}>
        <span className={oddsChipClass}>
          Yes
          {live ? (
            <LivePrice
              tokenId={outcomes[0].tokenId}
              fallback={outcomes[0].price}
              format="percent"
              className="font-semibold"
            />
          ) : (
            <span className="font-semibold">{outcomes[0].percent}</span>
          )}
        </span>
        <span className={oddsChipNoClass}>
          No
          {live ? (
            <LivePrice
              tokenId={outcomes[1].tokenId}
              fallback={outcomes[1].price}
              format="percent"
              className="font-semibold"
            />
          ) : (
            <span className="font-semibold">{outcomes[1].percent}</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${compact ? "" : "mt-3"}`}>
      {outcomes.map((outcome) => {
        const hasYesNo = outcome.noPrice !== undefined;

        return (
          <div key={outcome.label}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">{outcome.label}</span>
              {live ? (
                <LivePrice
                  tokenId={outcome.tokenId}
                  fallback={outcome.price}
                  format="percent"
                  className="shrink-0 text-sm font-semibold"
                />
              ) : (
                <span className="shrink-0 text-sm font-semibold">{outcome.percent}</span>
              )}
            </div>

            <ImpliedProbabilityBar
              tokenId={live ? outcome.tokenId : undefined}
              fallback={outcome.price}
              className="mb-1.5 h-1"
            />

            {hasYesNo && (
              <div className="flex gap-2">
                <span className={oddsChipCompactYesClass}>
                  Yes
                  {live ? (
                    <LivePrice
                      tokenId={outcome.tokenId}
                      fallback={outcome.price}
                      format="percent"
                      className="font-semibold"
                    />
                  ) : (
                    <span className="font-semibold">{outcome.percent}</span>
                  )}
                </span>
                <span className={oddsChipCompactNoClass}>
                  No
                  {live ? (
                    <LivePrice
                      tokenId={outcome.noTokenId}
                      fallback={outcome.noPrice ?? 0}
                      format="percent"
                      className="font-semibold"
                    />
                  ) : (
                    <span className="font-semibold">
                      {outcome.noPrice !== undefined ? formatPercent(outcome.noPrice) : "—"}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
