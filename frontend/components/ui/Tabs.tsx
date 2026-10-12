import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export type TabsItem = {
  key: string;
  label: string;
};

type TabsProps = {
  items: TabsItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  children?: ReactNode;
};

export function Tabs({ items, activeKey, onChange, className, children }: TabsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeKey === item.key
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
