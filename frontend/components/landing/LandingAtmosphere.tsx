"use client";

/**
 * Shadcn-style atmosphere: soft radial brand glow + fine dot grid.
 * Vision UI influence: restrained violet/pink blooms (no heavy particle field).
 */
export function LandingAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* Vision UI soft blooms */}
      <div className="absolute left-1/2 top-[-12%] h-[52vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.28)_0%,transparent_68%)] blur-2xl" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[45vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.12)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute bottom-[10%] right-[-15%] h-[40vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] blur-3xl" />

      {/* Shadcn-like dot grid */}
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

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.55)_100%)]" />
    </div>
  );
}
