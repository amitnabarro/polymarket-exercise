"use client";

import { useAtomValue } from "jotai";
import { wsStatusAtom } from "@/lib/atoms/prices";
import { useHydrated } from "@/lib/hooks/use-hydrated";

const STATUS_STYLES = {
  connected: "bg-yes shadow-[0_0_6px_rgba(34,197,94,0.6)]",
  connecting: "bg-amber-400 animate-pulse",
  disconnected: "bg-muted-foreground/40",
} as const;

const STATUS_LABELS = {
  connected: "Live",
  connecting: "Connecting…",
  disconnected: "Offline",
} as const;

export function LiveIndicator() {
  const hydrated = useHydrated();
  const status = useAtomValue(wsStatusAtom);
  const display = hydrated ? status : "disconnected";

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className={`h-2 w-2 rounded-full ${STATUS_STYLES[display]}`}
        aria-hidden
      />
      <span className="hidden sm:inline">{STATUS_LABELS[display]}</span>
    </div>
  );
}
