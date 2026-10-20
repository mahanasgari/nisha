"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, toFa, useInView } from "@/components/landing/useInView";

// Flat swatches stand in for product photos.
const products = [
  { name: "کفش روزمره", price: "۲٬۴۸۰٬۰۰۰", swatch: "#c8b8a2" },
  { name: "کیف چرمی", price: "۱٬۱۹۰٬۰۰۰", swatch: "#7a4a2e" },
  { name: "ساعت مینیمال", price: "۳٬۲۵۰٬۰۰۰", swatch: "#2f3a46" },
  { name: "عطر سبک", price: "۸۹۰٬۰۰۰", swatch: "#d9c6c9" },
];

// One sale, played on a loop: quiet → order → receipt → confirmed.
const STAGES = [
  { toast: null, product: -1 },
  { toast: { title: "سفارش تازه", body: "کیف چرمی · ۱٬۱۹۰٬۰۰۰ تومان", dot: "bg-[#ff4f9a]" }, product: 1 },
  { toast: { title: "رسید پرداخت رسید", body: "خریدار رسید واریز را فرستاد", dot: "bg-amber-400" }, product: 1 },
  { toast: { title: "پرداخت تایید شد", body: "سفارش آماده ارسال است", dot: "bg-emerald-400" }, product: -1 },
] as const;

const STAGE_MS = 2600;

/** Counts up from zero the first time `start` turns true, then follows `target` directly. */
function useCountUp(target: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(target);
  const played = useRef(false);
  useEffect(() => {
    if (!start) return;
    if (played.current || prefersReducedMotion()) {
      setValue(target);
      return;
    }
    played.current = true;
    let frame = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setValue(target);
    };
  }, [target, start, duration]);
  return value;
}

type LandingMockupProps = {
  className?: string;
};

/** Wide product preview for the hero: the seller panel playing one card-to-card sale. */
export function LandingMockup({ className }: LandingMockupProps) {
  const [viewRef, inView] = useInView<HTMLDivElement>(0.25);
  const [stage, setStage] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % STAGES.length);
    }, STAGE_MS);
    return () => window.clearInterval(timer);
  }, [inView]);

  useEffect(() => {
    if (stage === 1) setCycles((c) => c + 1);
  }, [stage]);

  // Completed sales so far, plus the one in flight.
  const done = Math.max(0, cycles - (stage === 0 ? 0 : 1));
  const orders = useCountUp(12 + done + (stage === 0 ? 0 : 1), inView);
  const pending = stage === 1 || stage === 2 ? 4 : 3;
  const revenue = useCountUp(48 + done + (stage === 3 ? 1 : 0), inView);

  const stats = [
    { label: "سفارش امروز", value: toFa(orders) },
    { label: "در انتظار تایید", value: toFa(pending) },
    { label: "فروش این ماه", value: `${toFa(revenue)} میلیون` },
  ];

  const current = STAGES[stage];

  return (
    <div ref={viewRef} className={cn("relative mx-auto w-full max-w-5xl", className)}>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        {/* Address bar */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="text-xs font-semibold text-stone-300">پنل فروشنده</span>
          <div className="me-auto flex h-7 max-w-[15rem] flex-1 items-center justify-center rounded-md bg-white/[0.05] px-3">
            <span className="truncate text-[11px] text-stone-400" dir="ltr">
              atieh.nishaapp.ir
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[190px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden border-e border-white/10 p-4 lg:block">
            <p className="mb-4 text-sm font-bold text-white">آتیه استور</p>
            <ul className="space-y-0.5 text-sm text-stone-400">
              {["داشبورد", "سفارش‌ها", "محصول‌ها", "گفتگوها", "تنظیمات"].map((item, i) => (
                <li
                  key={item}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2",
                    i === 0 && "bg-white/[0.07] text-white",
                  )}
                >
                  {item}
                  {i === 1 && (
                    <span
                      className={cn(
                        "rounded-full bg-[#ff4f9a] px-1.5 text-[10px] font-bold leading-4 text-[#1a0610] transition-opacity duration-300",
                        pending > 3 ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {toFa(1)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main */}
          <div className="relative p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-stone-500">آتیه استور</p>
                <h3 className="text-lg font-bold text-white">داشبورد</h3>
              </div>
              <span className="flex items-center gap-1.5 rounded-md bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                فروشگاه باز است
              </span>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "rounded-lg border px-3 py-3 transition-colors duration-500",
                    index === 1 && pending > 3 ? "border-[#ff4f9a]/50" : "border-white/10",
                  )}
                >
                  <p className="text-lg font-bold tabular-nums text-white sm:text-xl">{item.value}</p>
                  <p className="mt-0.5 text-[11px] text-stone-500 sm:text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product.name}
                  className={cn(
                    "overflow-hidden rounded-md border transition-colors duration-500",
                    current.product === index ? "border-[#ff4f9a]" : "border-white/10",
                  )}
                >
                  <div className="h-12 sm:h-14" style={{ backgroundColor: product.swatch }} />
                  <div className="space-y-0.5 p-1.5 sm:p-2">
                    <p className="truncate text-[11px] font-medium text-white sm:text-xs">{product.name}</p>
                    <p className="text-[10px] text-stone-500">{product.price} تومان</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notification toasts */}
            <div className="pointer-events-none absolute inset-x-3 top-3 sm:inset-x-auto sm:end-4 sm:top-4 sm:w-[17rem]">
              {STAGES.map((item, index) =>
                item.toast ? (
                  <div
                    key={item.toast.title}
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 top-0 flex items-center gap-3 rounded-lg border border-white/10 bg-[#211e1b] px-3 py-2.5 shadow-lg transition-all duration-300 ease-out",
                      stage === index ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                    )}
                  >
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", item.toast.dot)} />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-white">{item.toast.title}</span>
                      <span className="block truncate text-[11px] text-stone-400">{item.toast.body}</span>
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
