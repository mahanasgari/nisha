import { cn } from "@/lib/cn";

export type LandingButtonVariant = "primary" | "secondary" | "ghost";
export type LandingButtonSize = "sm" | "md" | "lg";

type LandingButtonClassesProps = {
  variant?: LandingButtonVariant;
  size?: LandingButtonSize;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0d0c]";

const variantClasses: Record<LandingButtonVariant, string> = {
  primary: "bg-[#ff4f9a] text-[#1a0610] hover:bg-[#ff6aab] focus-visible:ring-[#ff4f9a]/60",
  secondary:
    "border border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/[0.04] focus-visible:ring-white/30",
  ghost: "text-stone-300 hover:bg-white/[0.06] hover:text-white focus-visible:ring-white/30",
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
