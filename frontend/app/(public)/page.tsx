import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingMarquee } from "@/components/landing/LandingMarquee";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingScrollProgress } from "@/components/landing/LandingScrollProgress";
import { LandingStorePreview } from "@/components/landing/LandingStorePreview";
import { PaymentFlow } from "@/components/landing/PaymentFlow";
import { Reveal } from "@/components/landing/Reveal";
import { RotatingWords } from "@/components/landing/RotatingWords";
import { SellerPrimaryCta } from "@/components/landing/SellerPrimaryCta";
import { SpotlightGroup } from "@/components/landing/SpotlightGroup";
import { landingButtonClasses } from "@/components/landing/buttonStyles";
import { paths } from "@/lib/auth/paths";
import { cn } from "@/lib/cn";

const metaDescription =
  "فروشگاه آنلاین خود را رایگان بسازید، با کارت‌به‌کارت بفروشید و برای هیچ سفارشی کارمزد ندهید. ساده و کم‌هزینه، برای فروشنده‌های ایرانی.";

export const metadata: Metadata = {
  title: { absolute: "نیشا | فروشگاه‌ساز کارت‌به‌کارت" },
  description: metaDescription,
  openGraph: {
    title: "نیشا | فروشگاه بسازید، کارت‌به‌کارت بفروشید",
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
  { value: "۰ تومان", label: "شروع رایگان، بدون کارمزد فروش" },
  { value: "کارت‌به‌کارت", label: "پرداختی که مشتری ایرانی می‌شناسد" },
  { value: "شبانه‌روزی", label: "ویترینی که همیشه سفارش می‌گیرد" },
];

const svg = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {path}
  </svg>
);

const capabilities = [
  {
    icon: svg(<><path d="M3 9.5 5 4h14l2 5.5" /><path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M5 12v8h14v-8" /><path d="M10 20v-5h4v5" /></>),
    title: "ویترین خودتان",
    description: "اسم، لوگو و کاور فروشگاه را بگذارید تا مشتری با خیال راحت خرید کند.",
  },
  {
    icon: svg(<><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /><path d="M6.5 15h4" /></>),
    title: "فروش با کارت‌به‌کارت",
    description:
      "مشتری خرید می‌کند، مبلغ را به کارت شما واریز می‌کند و رسید را همان‌جا می‌فرستد. شما فقط تایید می‌کنید.",
  },
  {
    icon: svg(<><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z" /><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" /></>),
    title: "چت با مشتری",
    description: "مشتری درباره سایز یا رنگ سؤال دارد؟ همان‌جا در فروشگاه جواب بدهید تا خرید زودتر انجام شود.",
  },
  {
    icon: svg(<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>),
    title: "آمار فروش",
    description: "بازدید و فروش هر روز را از همان روز اول ببینید و بفهمید کدام محصول بهتر فروش می‌رود.",
  },
];

const goods = ["پوشاک", "کیف و کفش", "عطر و آرایشی", "کارهای دست‌ساز", "لوازم خانه"];

const buyerPoints = [
  {
    title: "پرداخت کارت‌به‌کارت",
    description: "همان روشی که همه بلدند: واریز به کارت و فرستادن رسید، بدون دردسر درگاه پرداخت.",
  },
  {
    title: "خرید سریع",
    description: "اسم و شماره تلفن کافی است. لازم نیست حساب کاربری بسازند.",
  },
  {
    title: "پیگیری سفارش",
    description: "با کد و رمز فاکتور، هر وقت بخواهند وضعیت سفارش را می‌بینند.",
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
    <>
    <LandingScrollProgress />
    <div className="space-y-24 lg:space-y-32">
      {/* Hero — shadcn centered SaaS composition */}
      <LandingSection className="pt-6 sm:pt-10 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="landing-enter" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-300 sm:text-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              <span>
                فروشگاه‌ساز کارت‌به‌کارت برای فروش{" "}
                <RotatingWords words={goods} className="font-semibold text-violet-200" />
              </span>
            </div>
          </div>

          <div className="landing-enter mt-7" style={{ animationDelay: "70ms" }}>
            <p className="landing-display text-5xl text-white sm:text-6xl lg:text-7xl">نیشا</p>
          </div>

          <div className="landing-enter mt-4" style={{ animationDelay: "120ms" }}>
            <h1 className="landing-display text-balance text-3xl text-white sm:text-4xl lg:text-5xl">
              فروشگاه آنلاین خود را بسازید،{" "}
              <span className="landing-gradient-text inline-block">با کارت‌به‌کارت بفروشید</span>
            </h1>
          </div>

          <div className="landing-enter mt-5" style={{ animationDelay: "180ms" }}>
            <p className="mx-auto max-w-2xl text-pretty text-base leading-8 text-zinc-400 sm:text-lg">
              ویترین را راه بیندازید، محصول بگذارید و سفارش بگیرید، بدون کارمزد روی فروش. هر وقت
              ابزار بیشتری لازم داشتید، پلن بگیرید.
            </p>
          </div>

          <div
            className="landing-enter mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <SellerPrimaryCta
              size="lg"
              className="landing-shine min-w-[11rem] px-6"
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
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
            <div className="landing-float landing-glass absolute -start-8 bottom-[10%] flex items-center gap-2 px-3 py-2 text-xs text-white">
              <span className="text-base font-bold text-emerald-300">۰٪</span>
              کارمزد روی فروش
            </div>
            <div
              className="landing-float landing-glass absolute -end-8 top-[42%] flex items-center gap-2 px-3 py-2 text-xs text-white"
              style={{ animationDelay: "1.6s" }}
            >
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              بدون نیاز به درگاه پرداخت
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection>
        <LandingMarquee />
      </LandingSection>

      <LandingSection>
        <Reveal>
          <div className="landing-surface grid gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 sm:py-8 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse lg:divide-white/10">
            {stats.map((item, index) => (
              <Reveal
                key={item.label}
                delay={150 + index * 110}
                className={cn(
                  "space-y-2 px-1 text-center lg:px-5 lg:text-start",
                  index === 0 && "lg:ps-0",
                  index === stats.length - 1 && "lg:pe-0",
                )}
              >
                <p className="bg-gradient-to-l from-white to-violet-200 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
                  {item.value}
                </p>
                <p className="text-sm leading-6 text-zinc-400">{item.label}</p>
              </Reveal>
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
                هر چه برای فروش روزانه لازم دارید، بدون پیچیدگی اضافه.
              </p>
            </div>
          </Reveal>

          <SpotlightGroup className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <article className="landing-surface landing-spotlight group h-full p-6 hover:border-violet-400/30 sm:p-7">
                  <div className="landing-icon mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-violet-300 transition-colors group-hover:border-violet-400/40 group-hover:bg-violet-500/15 group-hover:text-violet-100">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </SpotlightGroup>
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
                در چهار قدم کوتاه:
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
              <p className="landing-eyebrow">برای مشتری‌های شما</p>
              <h2 className="landing-display text-3xl text-white sm:text-4xl lg:text-5xl">
                خریدی آشنا و بی‌دردسر
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                کارت‌به‌کارت، سفارش سریع و پیگیری روشن؛ همان روشی که مشتری ایرانی با آن راحت است.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <PaymentFlow />
          </Reveal>

          <SpotlightGroup className="grid gap-4 md:grid-cols-3">
            {buyerPoints.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="h-full">
                <div className="landing-surface landing-spotlight h-full p-6 hover:border-violet-400/30">
                  <div className="mb-4 h-px w-10 bg-gradient-to-l from-violet-400 to-transparent" />
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </SpotlightGroup>
        </div>
      </LandingSection>

      <LandingSection id="faq">
        <LandingFaq />
      </LandingSection>

      <LandingSection>
        <Reveal>
          <section className="landing-glow-ring landing-border-spin relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-[#111113] to-[#09090b] p-8 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -end-10 -top-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl space-y-6 text-center">
              <p className="landing-eyebrow">همین حالا شروع کنید</p>
              <h2 className="landing-display text-3xl text-white sm:text-4xl">
                امروز ویترین را بسازید، از فردا بفروشید
              </h2>
              <p className="text-sm leading-7 text-zinc-400 sm:text-base">
                رایگان شروع کنید، لینک فروشگاه را برای مشتری‌ها بفرستید و با کارت‌به‌کارت پول بگیرید.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <SellerPrimaryCta
                  size="lg"
                  className="landing-shine min-w-[11rem] px-6"
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
    </>
  );
}
