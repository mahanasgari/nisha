"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  { buyer: "سارا", store: "آتیه استور", amount: "۲۴۸٬۰۰۰ تومان" },
  { buyer: "کیان", store: "چرم نوژان", amount: "۱٬۱۹۰٬۰۰۰ تومان" },
  { buyer: "نسترن", store: "خانه نور", amount: "۳۲۰٬۰۰۰ تومان" },
  { buyer: "امیر", store: "کافه دانه", amount: "۱۸۵٬۰۰۰ تومان" },
  { buyer: "هستی", store: "گالری خط", amount: "۴۱۰٬۰۰۰ تومان" },
];

export function LandingTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % EVENTS.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const event = EVENTS[index];

  return (
    <div className="landing-glass flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <p className="truncate text-sm text-white/80">
          <span className="text-white">{event.buyer}</span>
          {" از "}
          <span className="text-white">{event.store}</span>
          {" سفارش داد — "}
          <span className="font-medium text-white">{event.amount}</span>
        </p>
      </div>
      <p className="shrink-0 text-[11px] uppercase tracking-wider text-white/35">نمونه نمایشی</p>
    </div>
  );
}
