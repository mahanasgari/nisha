"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useTheme } from "@/contexts/ThemeContext";
import type { DesignStyle, ThemeMode } from "@/lib/theme";

type ThemeSwitcherProps = {
  variant?: "button" | "group" | "design";
  className?: string;
};

const themeModes: Array<{ value: ThemeMode; label: string }> = [
  { value: "light", label: "روشن" },
  { value: "dark", label: "تیره" },
  { value: "system", label: "سیستم" },
];

const designStyles: Array<{ value: DesignStyle; label: string }> = [
  { value: "saas", label: "مدرن" },
  { value: "classic", label: "کلاسیک" },
  { value: "glass", label: "شیشه‌ای" },
];

export function ThemeSwitcher({ variant = "button", className }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, designStyle, setTheme, setDesignStyle, toggleTheme } = useTheme();

  if (variant === "button") {
    const nextLabel = resolvedTheme === "dark" ? "روشن" : "تیره";

    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={className}
        aria-label={`تغییر به حالت ${nextLabel}`}
      >
        {nextLabel}
      </Button>
    );
  }

  if (variant === "design") {
    return (
      <div className={cn("inline-flex max-w-full flex-wrap rounded-lg border border-border bg-surface-muted p-0.5", className)}>
        {designStyles.map((style) => {
          const active = designStyle === style.value;

          return (
            <button
              key={style.value}
              type="button"
              onClick={() => setDesignStyle(style.value)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3",
                active
                  ? "vui-primary-btn bg-[rgb(var(--btn-primary))] text-[rgb(var(--btn-primary-fg))] shadow-sm"
                  : "text-foreground-muted hover:text-foreground",
              )}
              aria-pressed={active}
            >
              {style.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {themeModes.map((mode) => {
        const active = theme === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => setTheme(mode.value)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[rgb(var(--btn-primary))] text-[rgb(var(--btn-primary-fg))] shadow-sm"
                : "bg-surface-muted text-foreground hover:bg-surface/80",
            )}
            aria-pressed={active}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
