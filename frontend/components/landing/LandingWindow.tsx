import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LandingWindowProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function LandingWindow({ children, className, title = "nisha.store" }: LandingWindowProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[34rem]", className)}>
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] shadow-[0_24px_80px_rgba(8,4,20,0.45)] backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          </div>
          <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-wider text-white/50" dir="ltr">
            {title}
          </p>
        </div>
        <div className="bg-black/25 p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}
