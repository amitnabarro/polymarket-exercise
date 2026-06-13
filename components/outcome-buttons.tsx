"use client";

import { memo } from "react";
import { LivePrice } from "./live-price";

interface Outcome {
  label: string;
  percent: string;
  price: number;
  tokenId?: string;
}

interface OutcomeButtonsProps {
  outcomes: Outcome[];
  compact?: boolean;
  live?: boolean;
}

export const OutcomeButtons = memo(function OutcomeButtons({
  outcomes,
  compact,
  live,
}: OutcomeButtonsProps) {
  if (outcomes.length === 0) return null;

  if (outcomes.length === 2 && outcomes[0].label === "Yes") {
    return (
      <div className={`flex gap-2 ${compact ? "" : "mt-3"}`}>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-yes/12 px-3 py-2 text-sm font-medium text-yes ring-1 ring-yes/20 transition-colors hover:bg-yes/20"
        >
          Yes
          {live ? (
            <LivePrice tokenId={outcomes[0].tokenId} fallback={outcomes[0].price} className="font-semibold" />
          ) : (
            <span className="font-semibold">{outcomes[0].percent}</span>
          )}
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-no/12 px-3 py-2 text-sm font-medium text-no ring-1 ring-no/20 transition-colors hover:bg-no/20"
        >
          No
          {live ? (
            <LivePrice tokenId={outcomes[1].tokenId} fallback={outcomes[1].price} className="font-semibold" />
          ) : (
            <span className="font-semibold">{outcomes[1].percent}</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${compact ? "" : "mt-3"}`}>
      {outcomes.map((outcome) => (
        <div key={outcome.label} className="flex items-center justify-between gap-2">
          <span className="truncate text-sm text-muted-foreground">{outcome.label}</span>
          <div className="flex items-center gap-2">
            {live ? (
              <LivePrice tokenId={outcome.tokenId} fallback={outcome.price} className="text-sm font-semibold" />
            ) : (
              <span className="text-sm font-semibold">{outcome.percent}</span>
            )}
            <div className="flex gap-1">
              <button
                type="button"
                className="rounded px-2 py-0.5 text-xs font-medium text-yes bg-yes/15 hover:bg-yes/25"
              >
                Yes
              </button>
              <button
                type="button"
                className="rounded px-2 py-0.5 text-xs font-medium text-no bg-no/15 hover:bg-no/25"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
