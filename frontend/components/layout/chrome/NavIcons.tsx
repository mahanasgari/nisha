import { cn } from "@/lib/cn";

export type NavIconName =
  | "dashboard"
  | "analytics"
  | "store"
  | "products"
  | "orders"
  | "discounts"
  | "chat"
  | "payments"
  | "subscription"
  | "users"
  | "plans"
  | "complaints"
  | "reviews"
  | "settings"
  | "profile"
  | "addresses"
  | "downloads"
  | "more"
  | "default";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName;
  className?: string;
}) {
  const cls = cn("h-5 w-5", className);

  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "analytics":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 15v-4" />
          <path d="M12 15V8" />
          <path d="M16 15v-6" />
        </svg>
      );
    case "store":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M4 10h16l-1.2 9.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 10Z" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "products":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="M3.3 7 12 12l8.7-5" />
          <path d="M12 22V12" />
        </svg>
      );
    case "orders":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "discounts":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M12 3 4 7v5c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V7l-8-4Z" />
          <path d="m9 14 6-6" />
          <circle cx="9.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0Z" />
          <path d="M8 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16 12h.01" />
        </svg>
      );
    case "payments":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      );
    case "subscription":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M12 3 4 7v5c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V7l-8-4Z" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16 19a4.5 4.5 0 0 1 5 0" />
        </svg>
      );
    case "plans":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h10" />
        </svg>
      );
    case "complaints":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
        </svg>
      );
    case "reviews":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="m12 3 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3Z" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      );
    case "addresses":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "downloads":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "more":
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

/** Infer icon from path for layouts that don't pass one. */
export function inferNavIcon(href: string, label: string): NavIconName {
  const h = href.toLowerCase();
  const l = label.toLowerCase();
  if (h.includes("dashboard") || l.includes("داشبورد")) return "dashboard";
  if (h.includes("analytics") || l.includes("آمار")) return "analytics";
  if (h.includes("product") || l.includes("محصول")) return "products";
  if (h.includes("order") || l.includes("سفارش")) return "orders";
  if (h.includes("discount") || l.includes("تخفیف")) return "discounts";
  if (h.includes("conversation") || h.includes("chat") || l.includes("گفتگو")) return "chat";
  if (h.includes("payment") || l.includes("پرداخت")) return "payments";
  if (h.includes("subscription") || l.includes("اشتراک")) return "subscription";
  if (h.includes("/store") || l.includes("فروشگاه") || l.includes("تنظیمات فروشگاه")) return "store";
  if (h.includes("user") || h.includes("customer") || l.includes("کاربر") || l.includes("مشتری")) return "users";
  if (h.includes("plan") || l.includes("پلن")) return "plans";
  if (h.includes("complaint") || l.includes("شکایت") || l.includes("اعتراض")) return "complaints";
  if (h.includes("review") || l.includes("نظر")) return "reviews";
  if (h.includes("setting") || l.includes("تنظیمات")) return "settings";
  if (h.includes("profile") || l.includes("پروفایل")) return "profile";
  if (h.includes("address") || l.includes("آدرس")) return "addresses";
  if (h.includes("download") || l.includes("دانلود")) return "downloads";
  return "default";
}

export function inferNavGroup(href: string, label: string): string {
  const icon = inferNavIcon(href, label);
  if (["dashboard", "analytics", "products", "orders", "discounts"].includes(icon)) {
    return "فروش";
  }
  if (["chat", "reviews", "complaints", "users"].includes(icon)) {
    return "ارتباط";
  }
  if (["profile", "addresses", "downloads"].includes(icon)) {
    return "حساب";
  }
  return "مدیریت";
}
