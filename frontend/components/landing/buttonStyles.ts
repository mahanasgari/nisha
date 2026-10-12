import { cn } from "@/lib/cn";

export type LandingButtonVariant = "primary" | "secondary" | "ghost";
export type LandingButtonSize = "sm" | "md" | "lg";

type LandingButtonClassesProps = {
  variant?: LandingButtonVariant;
  size?: LandingButtonSize;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]";

const variantClasses: Record<LandingButtonVariant, string> = {
  primary:
    "bg-white text-zinc-950 shadow-sm hover:bg-zinc-100 focus-visible:ring-white/40",
  secondary:
    "border border-white/15 bg-white/[0.04] text-white shadow-sm hover:bg-white/[0.08] focus-visible:ring-brand/40",
  ghost: "text-zinc-300 hover:bg-white/[0.06] hover:text-white focus-visible:ring-brand/40",
};

const sizeClasses: Record<LandingButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm sm:text-[15px]",
};

export function landingButtonClasses({
  variant = "primary",
  size = "md",
  className,
}: LandingButtonClassesProps = {}): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}
