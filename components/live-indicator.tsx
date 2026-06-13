"use client";

import { useAtomValue } from "jotai";
import { wsStatusAtom } from "@/lib/atoms/prices";

const STATUS_STYLES = {
  connected: "bg-yes shadow-[0_0_6px_rgba(34,197,94,0.6)]",
  connecting: "bg-amber-400 animate-pulse",
  disconnected: "bg-muted-foreground/40",
} as const;

export function LiveIndicator() {
  const status = useAtomValue(wsStatusAtom);

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className={`h-2 w-2 rounded-full ${STATUS_STYLES[status]}`}
        aria-hidden
      />
      <span className="hidden sm:inline">
        {status === "connected" ? "Live" : status === "connecting" ? "Connecting…" : "Offline"}
      </span>
    </div>
  );
}
