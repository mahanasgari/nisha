import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingMarquee } from "@/components/landing/LandingMarquee";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingStorePreview } from "@/components/landing/LandingStorePreview";
import { Reveal } from "@/components/landing/Reveal";
import { SellerPrimaryCta } from "@/components/landing/SellerPrimaryCta";
import { landingButtonClasses } from "@/components/landing/buttonStyles";
import { paths } from "@/lib/auth/paths";
import { cn } from "@/lib/cn";

const metaDescription =
  "فروشگاه آنلاینت را رایگان بساز، با کارت‌به‌کارت فروش کن و روی هر سفارش کارمزد نده — ساده و کم‌هزینه برای فروشنده‌های ایرانی.";

export const metadata: Metadata = {
  title: "نیشا | فروشگاه‌ساز کارت‌به‌کارت",
  description: metaDescription,
  openGraph: {
    title: "نیشا | فروشگاه بساز، کارت‌به‌کارت بفروش",
    description: metaDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نیشا | فروشگاه‌ساز کارت‌به‌کارت",
    description: metaDescription,
  },
};

const stats = [
  { value: "۵ دقیقه", label: "تا ساخت فروشگاه و اولین محصول" },
  { value: "۰ تومان", label: "شروع رایگان — بدون کارمزد فروش" },
  { value: "کارت‌به‌کارت", label: "پرداخت آشنا برای مشتری ایرانی" },
  { value: "۲۴/۷", label: "ویترین آنلاین همیشه در دسترس" },
];

const capabilities = [
  {
    title: "ویترین خودت",
    description: "اسم، لوگو و کاور را بگذار تا فروشگاهت جدی و قابل‌اعتماد دیده شود.",
  },
  {
    title: "فروش با کارت‌به‌کارت",
    description:
      "مشتری خرید می‌کند، به کارت تو واریز می‌کند و رسید را همان‌جا می‌فرستد. تو فقط تایید می‌کنی.",
  },
  {
    title: "چت با مشتری",
    description: "سوال سایز و رنگ؟ همان‌جا داخل فروشگاه جواب بده تا فروش راحت‌تر بسته شود.",
  },
  {
    title: "آمار فروش",
    description: "بازدید و فروش روزانه را از روز اول ببین تا بدانی چه چیزی بهتر می‌فروشد.",
  },
];

const buyerPoints = [
  {
    title: "پرداخت کارت‌به‌کارت",
    description: "همان روشی که همه بلدند: واریز به کارت و آپلود رسید — بدون سردرگمی درگاه.",
  },
  {
    title: "خرید سریع",
    description: "اسم و شماره کافی است؛ نیازی به ساخت حساب طولانی نیست.",
  },
  {
    title: "پیگیری سفارش",
    description: "با کد و رمز فاکتور، وضعیت سفارش را هر وقت بخواهد می‌بیند.",
  },
];

function LandingSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-24 lg:space-y-32">
      {/* Hero — shadcn centered SaaS composition */}
      <LandingSection className="pt-6 sm:pt-10 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="landing-enter" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              فروشگاه‌ساز کارت‌به‌کارت برای ایران
            </div>
          </div>

          <div className="landing-enter mt-7" style={{ animationDelay: "70ms" }}>
            <p className="landing-display text-5xl text-white sm:text-6xl lg:text-7xl">نیشا</p>
          </div>

          <div className="landing-enter mt-4" style={{ animationDelay: "120ms" }}>
            <h1 className="landing-display text-balance text-3xl text-white sm:text-4xl lg:text-5xl">
              فروشگاه آنلاینت را بساز،{" "}
              <span className="text-zinc-500">با کارت‌به‌کارت بفروش</span>
            </h1>
          </div>

          <div className="landing-enter mt-5" style={{ animationDelay: "180ms" }}>
            <p className="mx-auto max-w-2xl text-pretty text-base leading-8 text-zinc-400 sm:text-lg">
              ویترینت را بالا بیاور، محصول بگذار و سفارش بگیر — بدون کارمزد روی هر فروش. فقط وقتی لازم
              شد، برای ابزارهای بیشتر اشتراک بگیر.
            </p>
          </div>

          <div
            className="landing-enter mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <SellerPrimaryCta
              size="lg"
              className="min-w-[11rem] px-6"
              guestLabel="شروع رایگان"
              sellerLabel="رفتن به داشبورد"
            />
            <Link
              href={paths.seller.login}
              className={landingButtonClasses({
                variant: "secondary",
                size: "lg",
                className: "min-w-[11rem] px-6",
              })}
            >
              ورود فروشنده
            </Link>
          </div>
        </div>

        <div className="landing-preview-enter relative mt-12 sm:mt-16">
          <div className="pointer-events-none absolute inset-x-8 -top-10 h-24 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.35),transparent_70%)] blur-2xl" />
          <LandingStorePreview />
        </div>
      </LandingSection>

      <LandingSection>
        <LandingMarquee />
      </LandingSection>

      <LandingSection>
        <Reveal>
          <div className="landing-surface grid gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 sm:py-8 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse lg:divide-white/10">
            {stats.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "space-y-2 px-1 text-center lg:px-5 lg:text-start",
                  index === 0 && "lg:ps-0",
                  index === stats.length - 1 && "lg:pe-0",
                )}
              >
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {item.value}
                </p>
                <p className="text-sm leading-6 text-zinc-400">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </LandingSection>

      <LandingSection id="features">
        <div className="space-y-10">
          <Reveal>
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="landing-eyebrow">چرا نیشا؟</p>
              <h2 className="landing-display text-3xl text-white sm:text-4xl lg:text-5xl">
                فروش ساده، هزینه کم
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                همان چیزهایی که برای فروش روزمره لازم داری — بدون پیچیدگی اضافه.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <article className="landing-surface group h-full p-6 transition-colors duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.06] sm:p-7">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm font-semibold text-violet-300 transition-colors group-hover:border-violet-400/40 group-hover:bg-violet-500/15">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 sm:text-sm">
            خرید مهمان و بعضی ابزارهای پیشرفته از پلن پایه به بعد فعال می‌شوند.
          </p>
        </div>
      </LandingSection>

      <LandingSection id="how">
        <div className="space-y-10">
          <Reveal>
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="landing-eyebrow">چطور کار می‌کند؟</p>
              <h2 className="landing-display text-3xl text-white sm:text-4xl lg:text-5xl">
                از صفر تا اولین فروش
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                چهار قدم کوتاه — هر کدام را پایین دنبال کن.
              </p>
            </div>
          </Reveal>
          <HowItWorks />
        </div>
      </LandingSection>

      <LandingSection id="pricing">
        <LandingPricing className="landing-pricing" />
      </LandingSection>

      <LandingSection>
        <div className="space-y-10">
          <Reveal>
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="landing-eyebrow">برای مشتری‌هایت</p>
              <h2 className="landing-display text-3xl text-white sm:text-4xl lg:text-5xl">
                خرید آشنا و بی‌دردسر
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                کارت‌به‌کارت، سفارش سریع و پیگیری شفاف — همان چیزی که مشتری ایرانی راحت است.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {buyerPoints.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <div className="landing-surface h-full p-6">
                  <div className="mb-4 h-px w-10 bg-gradient-to-l from-violet-400 to-transparent" />
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </LandingSection>

      <LandingSection id="faq">
        <LandingFaq />
      </LandingSection>

      <LandingSection>
        <Reveal>
          <section className="landing-glow-ring relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-[#111113] to-[#09090b] p-8 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -end-10 -top-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl space-y-6 text-center">
              <p className="landing-eyebrow">بیا شروع کنیم</p>
              <h2 className="landing-display text-3xl text-white sm:text-4xl">
                امروز ویترینت را بساز، فردا بفروش
              </h2>
              <p className="text-sm leading-7 text-zinc-400 sm:text-base">
                رایگان شروع کن، لینک فروشگاهت را برای مشتری بفرست و با کارت‌به‌کارت فروش بگیر.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <SellerPrimaryCta
                  size="lg"
                  className="min-w-[11rem] px-6"
                  guestLabel="ساخت فروشگاه رایگان"
                  sellerLabel="رفتن به داشبورد"
                />
                <Link
                  href={paths.seller.login}
                  className={landingButtonClasses({
                    variant: "secondary",
                    size: "lg",
                    className: "min-w-[11rem] px-6",
                  })}
                >
                  ورود فروشنده
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </LandingSection>
    </div>
  );
}
