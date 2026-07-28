"use client";

import { useState } from "react";
import Image from "next/image";
import { Megaphone } from "lucide-react";

import { useBikes } from "@/context/BikeContext";
import { SocialContentPanel } from "@/components/SocialContentPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPriceVND, isDataUrl } from "@/lib/utils";

export default function AdminSocialContentPage() {
  const { bikes } = useBikes();
  const [selectedBikeId, setSelectedBikeId] = useState<string>("");

  const effectiveBikeId = selectedBikeId || bikes[0]?.id || "";
  const selectedBike =
    bikes.find((bike) => bike.id === effectiveBikeId) ?? null;

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Megaphone className="h-6 w-6 text-primary" />
          AI Sinh Content Social
        </h1>
        <p className="text-sm text-muted-foreground">
          Chọn một chiếc xe, hệ thống sẽ tự động sinh nội dung đăng bán cho
          Facebook/Zalo và Chợ Tốt, sẵn sàng copy đăng bài.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Chọn Xe</CardTitle>
          <CardDescription>
            Chọn sản phẩm cần tạo nội dung quảng cáo (bao gồm cả xe đang ẩn).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={effectiveBikeId} onValueChange={setSelectedBikeId}>
            <SelectTrigger className="w-full sm:w-96">
              <SelectValue placeholder="Chọn xe" />
            </SelectTrigger>
            <SelectContent>
              {bikes.map((bike) => (
                <SelectItem key={bike.id} value={bike.id}>
                  {bike.name} - {bike.brand} ({formatPriceVND(bike.price)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBike && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={selectedBike.thumbnail}
                  alt={selectedBike.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                  unoptimized={isDataUrl(selectedBike.thumbnail)}
                />
              </div>
              <div>
                <CardTitle className="text-base">
                  Nội dung cho: {selectedBike.name}
                </CardTitle>
                <CardDescription>
                  {selectedBike.brand} · {selectedBike.productType} ·{" "}
                  {formatPriceVND(selectedBike.price)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SocialContentPanel bike={selectedBike} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
