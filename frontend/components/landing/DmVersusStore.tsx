"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/landing/Reveal";
import { toFa, useInView } from "@/components/landing/useInView";

type Message = { from: "buyer" | "seller"; text: string; time: string; receipt?: boolean; ltr?: boolean };

// One ordinary sale, the way it usually goes in an Instagram DM.
const THREAD: Message[] = [
  { from: "buyer", text: "سلام، قیمت؟", time: "۱۴:۰۲" },
  { from: "seller", text: "سلام. ۱٬۱۹۰٬۰۰۰ تومان", time: "۱۴:۱۱" },
  { from: "buyer", text: "مشکی‌اش موجوده؟", time: "۱۴:۱۲" },
  { from: "seller", text: "بله موجوده", time: "۱۴:۲۶" },
  { from: "buyer", text: "شماره کارت رو می‌فرستید؟", time: "۱۴:۲۷" },
  { from: "seller", text: "۶۰۳۷ •••• •••• ۴۲۱۸", time: "۱۴:۳۰", ltr: true },
  { from: "buyer", text: "واریز کردم، اینم رسیدش", time: "۱۴:۴۱", receipt: true },
  { from: "seller", text: "ممنون. آدرس و کد پستی رو هم بفرستید", time: "۱۵:۰۵" },
  { from: "buyer", text: "کی می‌رسه؟", time: "۱۵:۰۹" },
];

const STEPS = [
  {
    title: "مشتری لینک را باز می‌کند",
    text: "قیمت، رنگ‌ها و موجودی را روی صفحه محصول می‌بیند. لازم نیست بپرسد.",
  },
  {
    title: "خودش سفارش ثبت می‌کند",
    text: "اسم، شماره تماس و آدرس را در فرم سفارش وارد می‌کند.",
  },
  {
    title: "رسید را روی همان سفارش می‌فرستد",
    text: "شماره کارت شما را همان‌جا می‌بیند، واریز می‌کند و عکس رسید را بارگذاری می‌کند.",
  },
  {
    title: "شما پرداخت را تایید می‌کنید",
    text: "رسید کنار سفارش است. بررسی می‌کنید و با یک دکمه تایید می‌کنید.",
  },
];

function DmThread() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-[#ddd3c4] bg-[#fffdf9] shadow-[0_1px_0_#ddd3c4,0_18px_40px_-24px_rgba(31,27,23,0.35)]",
        inView && "is-playing",
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#eee7dc] px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#efe6d8] text-sm font-bold text-[#6b6258]">
          م
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[#1f1b17]">مشتری</span>
          <span className="block text-[11px] text-[#8a8178]">دایرکت اینستاگرام</span>
        </span>
      </div>

      <ol className="space-y-2 px-3 py-4 text-[13px] leading-6">
        {THREAD.map((message, index) => {
          const mine = message.from === "seller";
          return (
            <li
              key={index}
              className={cn("landing-bubble flex", mine ? "justify-end" : "justify-start")}
              style={{ transitionDelay: `${index * 380}ms` } as CSSProperties}
            >
              <span
                className={cn(
                  "max-w-[78%] rounded-2xl px-3 py-1.5",
                  mine ? "rounded-ee-md bg-[#1f1b17] text-[#f4f1ec]" : "rounded-es-md bg-[#efe9df] text-[#1f1b17]",
                )}
              >
                {message.receipt && (
                  <span className="mb-1.5 block rounded-lg border border-[#ddd3c4] bg-[#fffdf9] px-2.5 py-2 text-[11px] leading-5 text-[#6b6258]">
                    <span className="block font-semibold text-[#1f1b17]">رسید انتقال وجه</span>
                    ۱٬۱۹۰٬۰۰۰ تومان
                  </span>
                )}
                <span dir={message.ltr ? "ltr" : undefined} className={cn(message.ltr && "inline-block tabular-nums")}>
                  {message.text}
                </span>
                <span className={cn("ms-2 align-bottom text-[10px]", mine ? "text-white/45" : "text-[#8a8178]")}>
                  {message.time}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** A real-looking DM sale next to the same sale on a Nisha store. */
export function DmVersusStore() {
  return (
    <div className="landing-paper">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="landing-display text-3xl text-[#1f1b17] sm:text-4xl">
              فروش در دایرکت معمولاً این شکلی است
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b6258]">
              {toFa(THREAD.length)} پیام و یک ساعت رفت‌وبرگشت برای یک کیف، و هنوز آدرس نرسیده. همین سفارش در
              نیشا بدون چت ثبت می‌شود.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
          <DmThread />

          <div>
            <p className="text-sm font-semibold text-[#b8135f]">همین سفارش در نیشا</p>
            <ol className="mt-6 space-y-8">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <Reveal delay={index * 90} className="flex gap-5">
                    <span className="w-6 shrink-0 text-2xl font-extrabold leading-none text-[#b8135f]">
                      {toFa(index + 1)}
                    </span>
                    <span>
                      <span className="block text-lg font-bold text-[#1f1b17]">{step.title}</span>
                      <span className="mt-1.5 block leading-7 text-[#6b6258]">{step.text}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ol>
            <p className="mt-10 border-t border-[#ddd3c4] pt-6 leading-7 text-[#6b6258]">
              همه سفارش‌ها و رسیدها در پنل فروشنده یک‌جا می‌مانند و لازم نیست لای چت‌ها دنبال‌شان بگردید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
