"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Zap } from "lucide-react";

import { Bike } from "@/types/bike";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/SourceBadge";
import { BookingModal } from "@/components/BookingModal";
import { formatPriceVND, isDataUrl } from "@/lib/utils";

interface BikeCardProps {
  bike: Bike;
}

export function BikeCard({ bike }: BikeCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg">
        <Link href={`/bike/${bike.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={bike.thumbnail}
            alt={bike.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            unoptimized={isDataUrl(bike.thumbnail)}
          />
          <div className="absolute left-3 top-3">
            <SourceBadge source={bike.source} />
          </div>
          {bike.discountPercent > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
              -{bike.discountPercent}%
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {bike.brand} · {bike.productType}
          </p>
          <Link href={`/bike/${bike.slug}`}>
            <h3 className="line-clamp-2 font-semibold leading-snug hover:text-primary">
              {bike.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {bike.location}
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPriceVND(bike.price)}
            </span>
            {bike.originalPrice > bike.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPriceVND(bike.originalPrice)}
              </span>
            )}
          </div>

          {bike.stock <= 3 && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-600">
              <Zap className="h-3.5 w-3.5" />
              Chỉ còn {bike.stock} xe - Nhanh tay giữ xe!
            </p>
          )}

          <Button className="mt-2 w-full" onClick={() => setOpen(true)}>
            Giữ Xe Ngay
          </Button>
        </div>
      </div>

      <BookingModal bike={bike} open={open} onOpenChange={setOpen} />
    </>
  );
}
