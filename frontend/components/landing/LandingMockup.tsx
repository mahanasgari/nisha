import { cn } from "@/lib/cn";

const products = [
  { name: "کفش روزمره", price: "۲٬۴۸۰٬۰۰۰", tone: "from-violet-700/50 to-zinc-800" },
  { name: "کیف چرمی", price: "۱٬۱۹۰٬۰۰۰", tone: "from-fuchsia-800/40 to-zinc-900" },
  { name: "ساعت مینیمال", price: "۳٬۲۵۰٬۰۰۰", tone: "from-indigo-700/40 to-zinc-900" },
  { name: "عطر سبک", price: "۸۹۰٬۰۰۰", tone: "from-rose-800/35 to-zinc-900" },
];

const stats = [
  { label: "سفارش امروز", value: "۱۲" },
  { label: "در انتظار تایید", value: "۳" },
  { label: "فروش ماه", value: "۴۸م" },
];

type LandingMockupProps = {
  className?: string;
};

/** Wide SaaS product preview for the centered hero (guest). */
export function LandingMockup({ className }: LandingMockupProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-5xl", className)}>
      <div className="landing-glow-ring overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0f]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="mx-auto flex h-7 max-w-xs flex-1 items-center justify-center rounded-md border border-white/10 bg-black/30 px-3">
            <span className="truncate text-[11px] text-zinc-400">atieh.nishaapp.ir</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden border-e border-white/10 bg-white/[0.02] p-4 lg:block">
            <p className="mb-4 text-xs font-semibold text-white">آتیه استور</p>
            <ul className="space-y-1 text-sm text-zinc-400">
              {["داشبورد", "سفارش‌ها", "محصول‌ها", "گفتگوها", "تنظیمات"].map((item, i) => (
                <li
                  key={item}
                  className={cn(
                    "rounded-md px-3 py-2",
                    i === 0 ? "bg-white/10 text-white" : "hover:bg-white/[0.04]",
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main */}
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">فروشگاه آنلاین</p>
                <h3 className="text-lg font-semibold text-white">ویترین زنده</h3>
              </div>
              <span className="rounded-md border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-200">
                کارت‌به‌کارت فعال
              </span>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3"
                >
                  <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500 sm:text-xs">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="overflow-hidden rounded-md border border-white/10 bg-black/25"
                >
                  <div className={cn("h-12 bg-gradient-to-br sm:h-14", product.tone)} />
                  <div className="space-y-0.5 p-1.5 sm:p-2">
                    <p className="truncate text-[11px] font-medium text-white sm:text-xs">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-zinc-500">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
