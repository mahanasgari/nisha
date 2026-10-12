import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function FormSection({ title, description, action, children }: FormSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 space-y-0.5">
          <h2 className="text-sm font-semibold text-foreground sm:text-base">{title}</h2>
          {description ? <p className="text-xs leading-5 text-foreground-muted sm:text-sm">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
