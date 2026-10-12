"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/cn";
import type { DesignStyle, ThemeMode } from "@/lib/theme";

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

type AppearancePanelProps = {
  className?: string;
  /** @deprecated Always compact now — kept for call-site compatibility. */
  compact?: boolean;
};

function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-md border border-border bg-surface-muted p-0.5"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-medium transition-colors sm:px-2.5",
              active
                ? "bg-[rgb(var(--btn-primary))] text-[rgb(var(--btn-primary-fg))] shadow-sm"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Slim panel appearance toolbar — not a settings card. */
export function AppearancePanel({ className }: AppearancePanelProps) {
  const { theme, designStyle, setTheme, setDesignStyle } = useTheme();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-border/70 bg-surface/70 px-2.5 py-1.5",
        className,
      )}
    >
      <span className="text-[11px] font-medium text-foreground-muted">ظاهر پنل</span>
      <Segmented
        ariaLabel="سبک پنل"
        options={designStyles}
        value={designStyle}
        onChange={setDesignStyle}
      />
      <Segmented ariaLabel="حالت رنگ" options={themeModes} value={theme} onChange={setTheme} />
    </div>
  );
}
