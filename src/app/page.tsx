import Link from "next/link";
import { Bike as BikeIcon, PhoneCall, ShieldCheck, Truck } from "lucide-react";

import { mockBikes } from "@/data/mockBikes";
import { BikeCard } from "@/components/BikeCard";
import { BIKE_SOURCES, BikeSource } from "@/types/bike";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: BikeSource | "all" }[] = [
  { label: "Tất Cả", value: "all" },
  { label: BIKE_SOURCES["thanh-ly"].label, value: "thanh-ly" },
  { label: BIKE_SOURCES["xa-kho"].label, value: "xa-kho" },
  { label: BIKE_SOURCES["trung-bay"].label, value: "trung-bay" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeSource = resolvedSearchParams.source ?? "all";
  const bikes =
    activeSource === "all"
      ? mockBikes
      : mockBikes.filter((bike) => bike.source === activeSource);

  return (
    <main>
      <header className="border-b bg-secondary text-secondary-foreground">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <BikeIcon className="h-6 w-6 text-primary" />
            Xe Đạp Thanh Lý
          </div>
          <a
            href="tel:0900000000"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <PhoneCall className="h-4 w-4 text-primary" />
            0900.000.000
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-secondary to-secondary/90 text-secondary-foreground">
        <div className="container flex flex-col items-center gap-4 py-12 text-center">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Xe Đạp Thanh Lý, Xả Kho &amp; Trưng Bày
            <span className="block text-primary">Giá Tốt Nhất Thị Trường</span>
          </h1>
          <p className="max-w-xl text-sm text-secondary-foreground/80 sm:text-base">
            Chỉ cần để lại Tên &amp; Số Điện Thoại - Giữ xe ngay trong 1 phút,
            không cần thanh toán trước.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" /> Chính hãng, rõ
              nguồn gốc
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm">
              <Truck className="h-4 w-4 text-primary" /> Giao xe toàn quốc
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm">
              <PhoneCall className="h-4 w-4 text-primary" /> Xác nhận trong 15
              phút
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={filter.value === "all" ? "/" : `/?source=${filter.value}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                activeSource === filter.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>

        {bikes.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            Hiện chưa có xe nào trong danh mục này.
          </p>
        )}
      </section>

      <footer className="border-t bg-muted/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 Xe Đạp Thanh Lý. Chuyên xe đạp thanh lý, xả kho, trưng bày
          chính hãng.
        </div>
      </footer>
    </main>
  );
}
