"use client";

import Link from "next/link";
import * as storeApi from "@/lib/api/seller/store";
import { paths } from "@/lib/auth/paths";
import { useToast } from "@/contexts/ToastContext";
import { useSellerFetch } from "@/hooks/useSellerFetch";
import { PageHeader } from "@/components/layout/PageHeader";
import { StoreSettingsForm } from "@/components/seller/StoreSettingsForm";
import { AppearancePanel } from "@/components/theme/AppearancePanel";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { LoadingState } from "@/components/ui/LoadingState";
import type { StoreUpdate } from "@/types/seller/store";

export default function SellerStorePage() {
  const toast = useToast();
  const { data, error, isLoading, refetch } = useSellerFetch(() => storeApi.getStore(), []);

  async function handleSubmit(body: StoreUpdate) {
    await storeApi.updateStore(body);
    toast.success("تنظیمات فروشگاه ذخیره شد");
    await refetch();
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <PageHeader description="آنچه مشتری‌ها در صفحه فروشگاه شما می‌بینند" />
        <AppearancePanel />
        <LoadingState message="در حال بارگذاری فروشگاه…" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="page-stack">
        <PageHeader description="آنچه مشتری‌ها در صفحه فروشگاه شما می‌بینند" />
        <AppearancePanel />
        <ErrorAlert message={error ?? "تنظیمات باز نشد. صفحه را دوباره بارگذاری کنید."} />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        description="آنچه مشتری‌ها در صفحه فروشگاه شما می‌بینند"
        action={
          <Link href={paths.store(data.slug)} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">مشاهده فروشگاه</Button>
          </Link>
        }
      />
      <AppearancePanel />
      <StoreSettingsForm store={data} onSubmit={handleSubmit} />
    </div>
  );
}
