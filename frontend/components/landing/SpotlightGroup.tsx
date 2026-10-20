"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * Gives every `.landing-spotlight` card inside a soft glow that follows the mouse.
 * One listener on the group instead of one per card.
 */
export function SpotlightGroup({ children, className }: { children: ReactNode; className?: string }) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const card = (event.target as HTMLElement).closest<HTMLElement>(".landing-spotlight");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
