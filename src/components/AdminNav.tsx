"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin/orders", label: "📋 Đơn Hàng (CRM)" },
  { href: "/admin/products", label: "📦 Kho Xe (Sản Phẩm)" },
  { href: "/admin/auto-listing", label: "🤖 AI Đăng Xe Tự Động" },
  { href: "/admin/social-content", label: "📱 AI Sinh Content Social" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-secondary text-secondary-foreground shadow-sm">
      <div className="container flex flex-col gap-3 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin/orders" className="text-base font-bold sm:text-lg">
            🚴 Quản Lý Xe Đạp Thanh Lý
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium sm:inline">
              👤 Admin
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20 disabled:opacity-60"
            >
              {isLoggingOut ? "Đang thoát..." : "🚪 Đăng xuất"}
            </button>
          </div>
        </div>

        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-white/10 text-secondary-foreground/90 hover:bg-white/20"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
