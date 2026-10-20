"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/landing/Reveal";

const FAQS = [
  {
    q: "نیشا رایگان است؟",
    a: "بله. می‌توانید رایگان فروشگاه بسازید، محصول بگذارید و با کارت‌به‌کارت بفروشید. از سفارش‌ها کارمزد نمی‌گیریم و فقط برای ابزارهای بیشتر پلن پولی وجود دارد.",
  },
  {
    q: "پرداخت چطور انجام می‌شود؟",
    a: "مشتری مبلغ را به کارت شما واریز می‌کند و رسید را در صفحه سفارش می‌فرستد. شما در داشبورد پرداخت را تایید می‌کنید. درگاه پرداخت لازم نیست.",
  },
  {
    q: "برای شروع به کارت بانکی نیاز دارم؟",
    a: "بله. شماره کارت را در تنظیمات فروشگاه وارد کنید تا مشتری بداند مبلغ را به کجا واریز کند.",
  },
  {
    q: "مشتری باید حتماً حساب بسازد؟",
    a: "نه، از پلن پایه به بالا خرید مهمان فعال است و مشتری فقط با نام و شماره تلفن سفارش می‌دهد. بعد با کد و رمز فاکتور سفارشش را پیگیری می‌کند.",
  },
  {
    q: "چقدر طول می‌کشد تا فروشگاه آماده شود؟",
    a: "معمولاً چند دقیقه. ثبت‌نام می‌کنید، فروشگاه را می‌سازید، اولین محصول را می‌گذارید و لینک را برای مشتری‌ها می‌فرستید.",
  },
];

export function LandingFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="space-y-10">
      <Reveal>
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <p className="landing-eyebrow">سؤال‌های پرتکرار</p>
          <h2 className="landing-display text-3xl text-white sm:text-4xl lg:text-5xl">
            آنچه قبل از شروع می‌پرسند
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            اگر جواب سؤالتان اینجا نبود، از پشتیبانی داخل پنل بپرسید.
          </p>
        </div>
      </Reveal>

      <div className="mx-auto max-w-3xl space-y-2">
        {FAQS.map((item, index) => {
          const isOpen = open === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;
          return (
            <Reveal key={item.q} delay={index * 40}>
              <div className="landing-surface overflow-hidden">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-sm font-semibold text-white sm:text-base">{item.q}</span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition-transform",
                      isOpen && "rotate-45 text-white",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-zinc-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
