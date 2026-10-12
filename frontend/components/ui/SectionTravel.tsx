"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { OrbLoader, type OrbState } from "@/components/ui/OrbLoader";
import { cn } from "@/lib/cn";

type TravelOptions = {
  state?: OrbState;
  label?: string;
  durationMs?: number;
};

type SectionTravelContextValue = {
  /** Show a brief orb overlay, then run `action` (e.g. scroll / open modal). */
  travelTo: (action: () => void, options?: TravelOptions) => void;
  isTraveling: boolean;
};

const SectionTravelContext = createContext<SectionTravelContextValue | null>(null);

export function SectionTravelProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<{
    state: OrbState;
    label: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const travelTo = useCallback((action: () => void, options?: TravelOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const state = options?.state ?? "connecting";
    const label = options?.label ?? "در حال انتقال...";
    const durationMs = options?.durationMs ?? 720;

    setActive({ state, label });
    timerRef.current = setTimeout(() => {
      action();
      // Keep orb visible a beat after the jump so it doesn't feel abrupt
      timerRef.current = setTimeout(() => {
        setActive(null);
        timerRef.current = null;
      }, 280);
    }, durationMs);
  }, []);

  const value = useMemo(
    () => ({ travelTo, isTraveling: active !== null }),
    [travelTo, active],
  );

  return (
    <SectionTravelContext.Provider value={value}>
      {children}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-background/55 backdrop-blur-[2px] transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden={!active}
      >
        {active ? <OrbLoader state={active.state} size={64} label={active.label} /> : null}
      </div>
    </SectionTravelContext.Provider>
  );
}

export function useSectionTravel() {
  const ctx = useContext(SectionTravelContext);
  if (!ctx) {
    throw new Error("useSectionTravel must be used within SectionTravelProvider");
  }
  return ctx;
}
