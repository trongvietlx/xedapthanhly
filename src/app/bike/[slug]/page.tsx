import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { getBikeBySlug, mockBikes } from "@/data/mockBikes";
import { SourceBadge } from "@/components/SourceBadge";
import { BikeDetailBooking } from "@/components/BikeDetailBooking";
import { formatPriceVND } from "@/lib/utils";

export function generateStaticParams() {
  return mockBikes.map((bike) => ({ slug: bike.slug }));
}

export default async function BikeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = getBikeBySlug(slug);

  if (!bike) {
    notFound();
  }

  return (
    <main className="container py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Về trang chủ
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            <Image
              src={bike.images[0] ?? bike.thumbnail}
              alt={bike.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute left-3 top-3">
              <SourceBadge source={bike.source} />
            </div>
          </div>
          {bike.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {bike.images.map((img, i) => (
                <div
                  key={img}
                  className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  <Image
                    src={img}
                    alt={`${bike.name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {bike.brand} · {bike.category}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{bike.name}</h1>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {bike.location}
            </div>
          </div>

          <div className="flex items-baseline gap-3 rounded-xl bg-muted p-4">
            <span className="text-3xl font-extrabold text-primary">
              {formatPriceVND(bike.price)}
            </span>
            {bike.originalPrice > bike.price && (
              <span className="text-base text-muted-foreground line-through">
                {formatPriceVND(bike.originalPrice)}
              </span>
            )}
            {bike.discountPercent > 0 && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                -{bike.discountPercent}%
              </span>
            )}
          </div>

          {bike.stock <= 3 && (
            <p className="text-sm font-medium text-red-600">
              Chỉ còn {bike.stock} xe trong kho - Nhanh tay giữ xe trước khi
              hết!
            </p>
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">
            {bike.description}
          </p>

          <div className="rounded-xl border">
            <h2 className="border-b bg-muted/50 px-4 py-2 text-sm font-semibold">
              Thông Số Kỹ Thuật
            </h2>
            <dl className="divide-y">
              {Object.entries(bike.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <BikeDetailBooking bike={bike} />
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            Không mất phí đặt cọc - Nhân viên gọi lại xác nhận trong 15 phút
          </p>
        </div>
      </div>
    </main>
  );
}
