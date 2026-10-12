"use client";

import { cn } from "@/lib/cn";
import { OrbLoader, type OrbState } from "@/components/ui/OrbLoader";

type LoadingStateProps = {
  message?: string;
  className?: string;
  /** Orb animation verb — defaults to breathing for generic loads. */
  orbState?: OrbState;
};

export function LoadingState({
  message = "در حال بارگذاری...",
  className,
  orbState = "breathing",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-foreground-muted shadow-sm glass-panel backdrop-blur-xl",
        className,
      )}
    >
      <OrbLoader state={orbState} size={64} label={message} />
    </div>
  );
}
