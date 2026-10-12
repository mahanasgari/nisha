function getLocale(): string {
  return "fa-IR";
}

export function formatMoney(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  const formatted = new Intl.NumberFormat(getLocale(), {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
  return `${formatted} تومان`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(getLocale(), {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(getLocale(), { dateStyle: "medium" });
}

export function paymentMethodTypeLabel(type: string): string {
  if (type === "CARD_TO_CARD") return "کارت‌به‌کارت";
  if (type === "CRYPTO") return "رمزارز";
  if (type === "EXTERNAL_GATEWAY") return "درگاه پرداخت";
  return type;
}

const COMPLAINT_REASON_LABELS: Record<string, string> = {
  NON_DELIVERY: "سفارش نرسید",
  DAMAGED: "آسیب‌دیده",
  WRONG_ITEM: "کالای اشتباه",
  OTHER: "سایر",
};

export function complaintReasonLabel(reason: string): string {
  return COMPLAINT_REASON_LABELS[reason] ?? reason;
}

/** Customer's delivery confirmation on an order (not the payment receipt). */
export function deliveryReceiptLabel(status: string | null | undefined): string {
  if (status === "RECEIVED") return "تحویل گرفته";
  if (status === "NOT_RECEIVED") return "تحویل نگرفته";
  return "ثبت نشده";
}
