"use client";

import Link from "next/link";
import { paths } from "@/lib/auth/paths";
import { buttonClassName } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

type UpgradeGateProps = {
  title?: string;
  description: string;
  className?: string;
};

export function UpgradeGate({
  title = "این امکان در پلن بالاتر فعال است",
  description,
  className,
}: UpgradeGateProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-3 py-6">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
        <Link href={paths.seller.subscription} className={buttonClassName()}>
          دیدن پلن‌ها
        </Link>
      </CardContent>
    </Card>
  );
}
