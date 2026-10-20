"use client";

import { useEffect, useRef } from "react";

/**
 * Page backdrop: slow-drifting brand blooms, a fine dot grid and a soft light
 * that follows the cursor on mouse devices.
 */
export function LandingAtmosphere() {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        spot.style.setProperty("--spot-x", `${event.clientX}px`);
        spot.style.setProperty("--spot-y", `${event.clientY}px`);
        spot.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      <div className="absolute inset-0 bg-[#09090b]" />

      <div className="landing-blob-a absolute left-1/2 top-[-12%] h-[52vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.28)_0%,transparent_68%)] blur-2xl" />
      <div className="landing-blob-b absolute bottom-[-20%] left-[-10%] h-[45vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.14)_0%,transparent_70%)] blur-3xl" />
      <div className="landing-blob-c absolute bottom-[10%] right-[-15%] h-[40vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)] blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div
        ref={spotRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(520px circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(139,92,246,0.10), transparent 60%)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.55)_100%)]" />
    </div>
  );
}
