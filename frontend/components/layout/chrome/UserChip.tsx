import { cn } from "@/lib/cn";

type UserChipProps = {
  userName?: string | null;
  userMeta?: string | null;
  className?: string;
};

export function UserChip({ userName, userMeta, className }: UserChipProps) {
  if (!userName && !userMeta) return null;

  return (
    <div className={cn("glass-panel min-w-0 rounded-lg border border-border bg-surface-muted/60 px-3 py-2 backdrop-blur-xl", className)}>
      {userName && <p className="truncate text-sm font-medium text-foreground">{userName}</p>}
      {userMeta && <p className="truncate text-xs text-foreground-muted">{userMeta}</p>}
    </div>
  );
}
