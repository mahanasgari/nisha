"use client";

import { ThinkingOrb, type OrbState } from "thinking-orbs";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";

export type { OrbState };

type OrbLoaderProps = {
  state?: OrbState;
  size?: 20 | 64;
  speed?: number;
  className?: string;
  label?: string;
};

/** Theme-aware ThinkingOrb wrapper for Nisha loading / travel states. */
export function OrbLoader({
  state = "breathing",
  size = 64,
  speed = 1,
  className,
  label,
}: OrbLoaderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-2", className)}
      role="status"
      aria-live="polite"
      aria-label={label ?? "در حال بارگذاری"}
    >
      <ThinkingOrb
        state={state}
        size={size}
        speed={speed}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
      {label ? <span className="text-sm text-foreground-muted">{label}</span> : null}
    </div>
  );
}
