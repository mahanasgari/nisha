import type { Metadata } from "next";
import { SellerPrimaryCta } from "@/components/landing/SellerPrimaryCta";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "نیشا فروشگاه‌ساز برای شروع سریع فروش آنلاین با کارت‌به‌کارت، بدون کارمزد روی سفارش مشتری.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-6 sm:py-10">
      <h1 className="text-3xl font-bold text-foreground">درباره ما</h1>
      <p className="mt-2 text-sm text-foreground-muted">پلتفرم فروشگاه‌ساز نیشا</p>

      <div className="mt-8 space-y-8 leading-8 text-foreground">
        <section>
          <h2 className="mb-3 text-xl font-semibold">۱. نیشا چیست؟</h2>
          <p>
            نیشا فروشگاه‌سازی است که با آن در چند دقیقه ویترین آنلاین می‌سازید، محصول اضافه می‌کنید
            و با کارت‌به‌کارت می‌فروشید. از سفارش‌ها کارمزد نمی‌گیریم و فقط برای ابزارهای بیشتر
            پلن پولی وجود دارد.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">۲. برای چه کسانی؟</h2>
          <ul className="list-disc space-y-2 pr-6">
            <li>کسی که تازه می‌خواهد فروش آنلاین را شروع کند</li>
            <li>کسب‌وکاری که ویترین ساده، خرید مهمان و پیگیری سفارش می‌خواهد</li>
            <li>فروشگاهی که در حال رشد است و آمار دقیق‌تر، تم اختصاصی و کد تخفیف لازم دارد</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">۳. چطور کار می‌کند؟</h2>
          <ol className="list-decimal space-y-2 pr-6">
            <li>حساب فروشنده می‌سازید و فروشگاه را راه می‌اندازید.</li>
            <li>محصول‌ها، عکس‌ها و شماره کارت را اضافه می‌کنید.</li>
            <li>خریدار از ویترین سفارش می‌دهد. از پلن پایه به بالا، بدون ساختن حساب هم می‌تواند خرید کند.</li>
            <li>وضعیت سفارش را در پنل به‌روز می‌کنید و خریدار سفارشش را با کد فاکتور پیگیری می‌کند.</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">۴. تعهد ما</h2>
          <ul className="list-disc space-y-2 pr-6">
            <li>
              <strong>شفافیت تعرفه:</strong> قیمت پلن‌ها و امکانات هر کدام در صفحه قیمت‌ها آمده است.
            </li>
            <li>
              <strong>امنیت داده:</strong> اطلاعات روی ارتباط امن منتقل و با دقت نگهداری می‌شود و حریم خصوصی رعایت می‌شود.
            </li>
            <li>
              <strong>پشتیبانی:</strong> در راه‌اندازی فروشگاه کنارتان هستیم و به شکایت‌ها طبق رویه اعلام‌شده رسیدگی می‌کنیم.
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface-muted/50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">آماده‌اید شروع کنید؟</p>
          <p className="mt-1 text-sm text-foreground-muted">فروشگاه خود را با پلن رایگان بسازید.</p>
        </div>
        <SellerPrimaryCta guestLabel="شروع رایگان" size="md" />
      </div>
    </div>
  );
}
