import { Reveal } from "@/components/landing/Reveal";

const STEPS = [
  {
    title: "ثبت‌نام کنید و فروشگاه را بسازید",
    description: "اسم، لوگو و کاور را می‌گذارید و لینک اختصاصی فروشگاه را می‌گیرید.",
  },
  {
    title: "محصول‌ها را اضافه کنید",
    description: "برای هر محصول عکس، قیمت، رنگ و سایز و موجودی را وارد کنید.",
  },
  {
    title: "شماره کارت را بگذارید و لینک را بفرستید",
    description: "لینک را در بیو اینستاگرام، کانال تلگرام یا هر جای دیگری که مشتری دارید بگذارید.",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
      {STEPS.map((step, index) => (
        <li key={step.title}>
          <Reveal delay={index * 90} className="border-t border-white/15 pt-5">
            <span className="text-sm font-bold text-[#ff4f9a]">قدم {(index + 1).toLocaleString("fa-IR")}</span>
            <h3 className="mt-2 text-lg font-bold text-white">{step.title}</h3>
            <p className="mt-2 leading-7 text-stone-400">{step.description}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
