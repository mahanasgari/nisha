import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { DmVersusStore } from "@/components/landing/DmVersusStore";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingStorePreview } from "@/components/landing/LandingStorePreview";
import { Reveal } from "@/components/landing/Reveal";
import { SellerPrimaryCta } from "@/components/landing/SellerPrimaryCta";
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

const features = [
  {
    title: "ویترین با اسم و لوگوی خودتان",
    description: "اسم، لوگو و کاور فروشگاه را می‌گذارید و یک لینک اختصاصی می‌گیرید.",
  },
  {
    title: "رسید کنار سفارش",
    description: "خریدار عکس رسید را روی همان سفارش می‌فرستد. نگاه می‌کنید و پرداخت را تایید می‌کنید.",
  },
  {
    title: "چت روی صفحه فروشگاه",
    description: "سؤال سایز و رنگ را همان‌جا جواب می‌دهید و گفتگو کنار سفارش می‌ماند.",
  },
  {
    title: "پیگیری با کد فاکتور",
    description: "خریدار با کد و رمز فاکتور وضعیت سفارشش را می‌بیند و لازم نیست از شما بپرسد.",
  },
  {
    title: "خرید بدون ثبت‌نام",
    description: "خریدار فقط با اسم و شماره تلفن سفارش می‌دهد. این امکان از پلن پایه فعال است.",
  },
  {
    title: "آمار فروش",
    description: "می‌بینید هر روز چند نفر سر زدند و کدام محصول بیشتر فروش رفت.",
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
    <section id={id} className={cn("mx-auto w-full max-w-6xl scroll-mt-20 px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
}

function SectionHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <Reveal>
      <div className="max-w-2xl space-y-3">
        <h2 className="landing-display text-3xl text-white sm:text-4xl">{title}</h2>
        {lead ? <p className="leading-7 text-stone-400">{lead}</p> : null}
      </div>
    </Reveal>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-24 lg:space-y-32">
      <LandingSection className="pt-10 sm:pt-16 lg:pt-20">
        <div className="max-w-3xl">
          <p className="landing-enter text-sm font-medium text-stone-400" style={{ animationDelay: "0ms" }}>
            فروشگاه‌ساز کارت‌به‌کارت برای فروشنده‌های اینستاگرام و تلگرام
          </p>

          <h1
            className="landing-enter landing-display mt-5 text-balance text-4xl text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            به جای جواب دادن به «قیمت؟»، <span className="landing-marker">لینک فروشگاه</span> را بفرستید.
          </h1>

          <p
            className="landing-enter mt-6 max-w-2xl text-pretty text-base leading-8 text-stone-300 sm:text-lg sm:leading-9"
            style={{ animationDelay: "120ms" }}
          >
            قیمت، عکس و موجودی هر محصول روی فروشگاه خودتان است. مشتری سفارش می‌دهد، مبلغ را کارت‌به‌کارت
            واریز می‌کند و رسید را همان‌جا می‌فرستد. شما فقط تایید می‌کنید.
          </p>

          <div
            className="landing-enter mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "180ms" }}
          >
            <SellerPrimaryCta
              size="lg"
              className="sm:min-w-[12rem]"
              guestLabel="فروشگاه رایگان بسازید"
              sellerLabel="رفتن به داشبورد"
            />
            <Link href={paths.seller.login} className={landingButtonClasses({ variant: "secondary", size: "lg" })}>
              ورود فروشنده
            </Link>
          </div>

          <p className="landing-enter mt-5 text-sm text-stone-500" style={{ animationDelay: "220ms" }}>
            بدون درگاه پرداخت و بدون کارمزد روی سفارش‌ها.
          </p>
        </div>

        <div className="landing-preview-enter mt-14 sm:mt-16">
          <LandingStorePreview />
        </div>
      </LandingSection>

      <DmVersusStore />

      <LandingSection id="features">
        <div className="space-y-12">
          <SectionHeading
            title="آنچه در پنل فروشنده دارید"
            lead="همه چیز برای فروش روزانه، بدون تنظیمات پیچیده."
          />
          <dl className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 70} className="border-t border-white/10 py-6">
                <dt className="font-bold text-white">{item.title}</dt>
                <dd className="mt-2 leading-7 text-stone-400">{item.description}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </LandingSection>

      <LandingSection id="how">
        <div className="space-y-12">
          <SectionHeading
            title="راه‌اندازی در سه قدم"
            lead="برنامه‌نویسی و درگاه پرداخت لازم نیست. فقط یک کارت بانکی برای واریز."
          />
          <HowItWorks />
        </div>
      </LandingSection>

      <LandingSection id="pricing">
        <LandingPricing className="landing-pricing" />
      </LandingSection>

      <LandingSection id="faq">
        <LandingFaq />
      </LandingSection>

      <LandingSection>
        <Reveal>
          <div className="flex flex-col gap-8 border-t border-white/10 pt-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="landing-display text-3xl text-white sm:text-4xl">
                فروشگاه را امروز بسازید و لینکش را در بیو بگذارید.
              </h2>
              <p className="leading-7 text-stone-400">
                رایگان است و هر وقت ابزار بیشتری لازم داشتید، پلن را ارتقا می‌دهید.
              </p>
            </div>
            <SellerPrimaryCta
              size="lg"
              className="shrink-0 sm:min-w-[12rem]"
              guestLabel="فروشگاه رایگان بسازید"
              sellerLabel="رفتن به داشبورد"
            />
          </div>
        </Reveal>
      </LandingSection>
    </div>
  );
}
