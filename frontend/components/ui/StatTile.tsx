import { cn } from "@/lib/cn";

type StatTileProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function StatTile({ label, value, className }: StatTileProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-lg border border-border bg-surface/90 p-5 shadow-sm backdrop-blur-sm max-md:p-3",
        className,
      )}
    >
      <p className="text-sm text-foreground-muted max-md:text-xs">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground max-md:mt-1 max-md:text-lg">
        {value}
      </p>
    </div>
  );
}
