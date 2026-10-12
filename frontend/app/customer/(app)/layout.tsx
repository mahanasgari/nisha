"use client";

import { CustomerAuthGuard } from "@/components/auth/CustomerAuthGuard";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { paths } from "@/lib/auth/paths";

export default function CustomerAppLayout({ children }: { children: React.ReactNode }) {
  const { customer, logout } = useCustomerAuth();

  const navItems = [
    { href: paths.customer.dashboard, label: "داشبورد" },
    { href: paths.customer.profile, label: "پروفایل" },
    { href: paths.customer.addresses, label: "آدرس‌ها" },
    { href: paths.customer.orders, label: "سفارش‌ها" },
    { href: paths.customer.complaints, label: "شکایت‌ها" },
    { href: paths.customer.downloads, label: "دانلودها" },
    { href: paths.customer.reviews, label: "نظرها" },
    { href: paths.customer.conversations, label: "گفتگوها" },
  ];

  return (
    <CustomerAuthGuard>
      <WorkspaceShell
        variant="tabs"
        brandLabel="Nisha"
        roleLabel="حساب مشتری"
        title="حساب من"
        userName={customer?.full_name}
        userMeta={customer?.email ?? customer?.phone ?? undefined}
        identityName={customer?.full_name ?? "حساب من"}
        navItems={navItems}
        onLogout={logout}
      >
        {children}
      </WorkspaceShell>
    </CustomerAuthGuard>
  );
}
