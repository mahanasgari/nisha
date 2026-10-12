"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type ChromeNavItem = {
  href: string;
  label: string;
  description?: string;
};

type ChromeNavProps = {
  items: ChromeNavItem[];
  variant: "pills" | "sidebar" | "vision";
  onNavigate?: () => void;
  className?: string;
  scrollable?: boolean;
  compact?: boolean;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navMark(label: string) {
  return label.trim().slice(0, 1) || "•";
}

export function ChromeNav({
  items,
  variant,
  onNavigate,
  className,
  scrollable = false,
  compact = false,
}: ChromeNavProps) {
  const pathname = usePathname();

  if (variant === "vision") {
    return (
      <nav className={cn("flex flex-col gap-1 py-1", className)}>
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn("vui-nav-item", active && "is-active")}
            >
              <span className="vui-nav-icon" aria-hidden>
                {navMark(item.label)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{item.label}</span>
                {item.description ? (
                  <span className="mt-0.5 block truncate text-xs opacity-70">{item.description}</span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  if (variant === "pills") {
    return (
      <nav
        className={cn(
          "flex gap-1 rounded-lg border border-border bg-surface-muted/50 p-1",
          scrollable
            ? "overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex-wrap",
          className,
        )}
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "whitespace-nowrap rounded-md font-medium transition-colors",
                compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
                active
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={cn("space-y-0.5", className)}>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "block rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-brand-soft text-brand-deep"
                : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            <span className="block font-medium">{item.label}</span>
            {item.description && (
              <span className="mt-0.5 block text-xs text-foreground-muted">
                {item.description}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
