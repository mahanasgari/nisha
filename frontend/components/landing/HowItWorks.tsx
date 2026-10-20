"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Step = {
  title: string;
  description: string;
  highlights: string[];
};

const STEPS: Step[] = [
  {
    title: "فروشگاه را بسازید",
    description:
      "اسم و لوگو را می‌گذارید، لینک اختصاصی می‌گیرید و ویترین آماده است. به برنامه‌نویسی هم نیازی نیست.",
    highlights: ["لینک اختصاصی", "لوگو و کاور", "شروع رایگان"],
  },
  {
    title: "محصول‌ها را بچینید",
    description:
      "عکس، قیمت و موجودی را اضافه کنید. اگر خواستید، کد تخفیف هم بسازید تا اولین فروش زودتر برسد.",
    highlights: ["گالری عکس", "تنوع رنگ و سایز", "کد تخفیف"],
  },
  {
    title: "با کارت‌به‌کارت بفروشید",
    description:
      "مشتری خرید می‌کند، مبلغ را به کارت شما واریز می‌کند و رسید را می‌فرستد. شما با یک نگاه تایید می‌کنید و کارمزدی هم در کار نیست.",
    highlights: ["کارت‌به‌کارت", "ارسال رسید", "چت با مشتری"],
  },
  {
    title: "رشد فروش را ببینید",
    description:
      "بازدید و فروش هر روز را در داشبورد ببینید تا بدانید کدام محصول واقعاً فروش می‌رود.",
    highlights: ["آمار بازدید و فروش", "فاکتور", "اعلان سفارش"],
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const items = Array.from(container.querySelectorAll("[data-step-index]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const raw = entry.target.getAttribute("data-step-index");
          const parsed = raw === null ? Number.NaN : Number(raw);
          if (!Number.isNaN(parsed)) setActive(parsed);
        }
      },
      { threshold: 0.55, rootMargin: "-10% 0px -25% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <div className="landing-glass relative h-[26rem] overflow-hidden">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                aria-hidden={active === index ? undefined : true}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center gap-6 p-10 text-center transition-all duration-500 ease-out motion-reduce:transition-none",
                  active === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                <span className="font-mono text-7xl font-semibold tracking-tight text-white/90">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-xl font-semibold text-foreground">{step.title}</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {step.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2">
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
        </div>
      </div>

      <ol className="relative space-y-6 ps-5 lg:space-y-24 lg:py-10 lg:ps-8">
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
