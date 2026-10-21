"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Step = {
  title: string;
  description: string;
  highlights: string[];
  caption: string;
};

const STEPS: Step[] = [
  {
    title: "فروشگاهت رو بساز",
    description: "اسم و لوگو رو می‌ذاری، لینک خودت رو می‌گیری. کد نویسی لازم نیست.",
    highlights: ["لینک خودت", "لوگو و کاور", "شروع رایگان"],
    caption: "ساخت فروشگاه",
  },
  {
    title: "محصول بذار",
    description: "عکس، قیمت و موجودی. اگر خواستی کد تخفیف هم بساز.",
    highlights: ["عکس محصول", "رنگ و سایز", "کد تخفیف"],
    caption: "اضافه کردن محصول",
  },
  {
    title: "کارت‌به‌کارت بگیر",
    description: "مشتری واریز می‌کنه، رسید رو می‌فرسته. تو تایید می‌کنی. کارمزد نداریم.",
    highlights: ["کارت‌به‌کارت", "رسید", "چت"],
    caption: "تایید پرداخت",
  },
  {
    title: "ببین چی فروش می‌ره",
    description: "هر روز چند نفر اومدن و کدوم محصول بیشتر رفت، تو داشبورده.",
    highlights: ["بازدید", "فروش", "اعلان سفارش"],
    caption: "داشبورد فروش",
  },
];

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 pb-1 pt-2 text-[9px] font-medium text-zinc-300">
      <span>۹:۴۱</span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-3 rounded-sm border border-current opacity-70" />
        <span className="h-2 w-1 rounded-sm bg-current opacity-80" />
      </span>
    </div>
  );
}

function ScreenShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="flex h-full flex-col bg-[#0c0c0f] text-white">
      <StatusBar />
      <div className="border-b border-white/10 px-3 pb-2.5">
        <p className="text-center text-[11px] font-semibold tracking-tight">{title}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

function ScreenBuildStore() {
  return (
    <ScreenShell title="فروشگاه جدید">
      <div className="space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/40 to-fuchsia-500/20 text-lg font-bold text-violet-100">
          آ
        </div>
        <label className="block space-y-1">
          <span className="text-[10px] text-zinc-500">اسم فروشگاه</span>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px]">آتیه استور</div>
        </label>
        <label className="block space-y-1">
          <span className="text-[10px] text-zinc-500">لینک فروشگاه</span>
          <div
            className="rounded-lg border border-violet-400/30 bg-violet-500/10 px-2.5 py-2 text-[11px] text-violet-100"
            dir="ltr"
          >
            atieh.nishaapp.ir
          </div>
        </label>
        <div className="rounded-xl bg-brand px-3 py-2.5 text-center text-[11px] font-semibold text-brand-foreground">
          فروشگاه رو بساز
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenAddProduct() {
  return (
    <ScreenShell title="محصول جدید">
      <div className="space-y-3">
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/15 bg-gradient-to-br from-fuchsia-800/35 to-zinc-900 text-[10px] text-zinc-400">
          عکس محصول
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px]">کیف چرمی</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px]">۱٬۱۹۰٬۰۰۰</div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px]">موجود</div>
        </div>
        <div className="flex gap-1.5">
          {["مشکی", "قهوه‌ای"].map((tone) => (
            <span key={tone} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-zinc-300">
              {tone}
            </span>
          ))}
        </div>
        <div className="rounded-xl bg-brand px-3 py-2.5 text-center text-[11px] font-semibold text-brand-foreground">
          ذخیره محصول
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenPayment() {
  return (
    <ScreenShell title="سفارش #۱۲۴">
      <div className="space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium">کیف چرمی</p>
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] text-amber-200">در انتظار</span>
          </div>
          <p className="mt-2 text-sm font-semibold tabular-nums">۱٬۱۹۰٬۰۰۰ تومان</p>
          <p className="mt-1 text-[10px] text-zinc-500" dir="ltr">
            ۶۰۳۷ •••• ۴۲۱۸
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-sky-400/25 bg-sky-500/10 p-2.5">
          <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-400/30 to-zinc-800 text-[9px] text-sky-100">
            رسید
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium">عکس واریز اومد</p>
            <p className="text-[10px] text-zinc-500">الان می‌تونی تایید کنی</p>
          </div>
        </div>
        <div className="rounded-xl bg-emerald-500 px-3 py-2.5 text-center text-[11px] font-semibold text-white">
          تایید پرداخت
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenDashboard() {
  const bars = [40, 65, 48, 80, 56, 92, 70];
  return (
    <ScreenShell title="داشبورد">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "سفارش امروز", value: "۱۲" },
            { label: "فروش ماه", value: "۴۸م" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2.5">
              <p className="text-base font-semibold tabular-nums tracking-tight">{stat.value}</p>
              <p className="mt-0.5 text-[9px] text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          <p className="mb-2 text-[10px] text-zinc-500">فروش این هفته</p>
          <div className="flex h-16 items-end gap-1.5">
            {bars.map((height, index) => (
              <span
                key={index}
                className={cn("flex-1 rounded-sm", index === bars.length - 1 ? "bg-violet-400" : "bg-white/15")}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/10 px-2.5 py-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400" />
          <p className="text-[10px] text-violet-100">سفارش تازه · کیف چرمی</p>
        </div>
      </div>
    </ScreenShell>
  );
}

const SCREENS = [ScreenBuildStore, ScreenAddProduct, ScreenPayment, ScreenDashboard];

function FloatingPhone({ active }: { active: number }) {
  return (
    <div className="relative mx-auto flex w-full max-w-[280px] flex-col items-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-4 top-16 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.28),transparent_70%)]"
      />

      <div className="landing-how-phone-stage relative w-full">
        <div className="landing-how-phone-float relative mx-auto w-[232px]">
          <div className="landing-how-phone relative w-full" data-pose={active}>
            <div className="relative rounded-[2rem] border border-white/20 bg-[#1a1a1e] p-[9px] shadow-[0_24px_64px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="absolute inset-x-[28%] top-[14px] z-20 h-[18px] rounded-full bg-black" />
              <div className="relative overflow-hidden rounded-[1.45rem] bg-black">
                <div className="relative h-[420px] w-full">
                  {SCREENS.map((StepScreen, index) => (
                    <div
                      key={STEPS[index].title}
                      aria-hidden={active !== index}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                        active === index
                          ? "translate-y-0 scale-100 opacity-100"
                          : "pointer-events-none translate-y-3 scale-[0.97] opacity-0",
                      )}
                    >
                      <StepScreen />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-1.5 z-10 flex justify-center">
                  <span className="h-1 w-20 rounded-full bg-white/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm font-medium text-zinc-300">{STEPS[active]?.caption}</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        {STEPS.map((step, index) => (
          <span
            key={step.title}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none",
              active === index ? "w-8 bg-brand" : "w-3 bg-white/15",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const items = Array.from(container.querySelectorAll("[data-step-index]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const raw = visible.target.getAttribute("data-step-index");
        const parsed = raw === null ? Number.NaN : Number(raw);
        if (!Number.isNaN(parsed)) setActive(parsed);
      },
      { threshold: [0.35, 0.55, 0.75], rootMargin: "-12% 0px -28% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-20"
    >
      <div className="hidden lg:block">
        <div className="sticky top-24 py-4">
          <FloatingPhone active={active} />
        </div>
      </div>

      <ol className="relative space-y-6 ps-5 lg:space-y-28 lg:py-8 lg:ps-8">
        <span aria-hidden className="absolute bottom-0 start-0 top-0 w-px bg-white/10 lg:start-2" />
        <span
          aria-hidden
          className="absolute start-0 top-0 w-px bg-gradient-to-b from-violet-400 via-fuchsia-400 to-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)] transition-[height] duration-700 ease-out motion-reduce:transition-none lg:start-2"
          style={{ height: `${((active + 1) / STEPS.length) * 100}%` }}
        />
        {STEPS.map((step, index) => (
          <li key={step.title} data-step-index={index}>
            <div
              className={cn(
                "rounded-xl border p-6 transition-all duration-500 motion-reduce:transition-none sm:p-8",
                active === index
                  ? "border-violet-400/30 bg-violet-500/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
                  : "border-white/10 bg-white/[0.03] lg:opacity-55",
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors duration-500",
                    active === index ? "bg-brand text-brand-foreground" : "bg-white/10 text-foreground-muted",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">{step.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground-muted sm:text-base">{step.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
                {step.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
