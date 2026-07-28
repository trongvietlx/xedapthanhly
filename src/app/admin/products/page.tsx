"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Megaphone, Search, Trash2 } from "lucide-react";

import { useBikes } from "@/context/BikeContext";
import { Bike, BIKE_CATEGORIES, BikeCategory } from "@/types/bike";
import { SourceBadge } from "@/components/SourceBadge";
import { SocialContentPanel } from "@/components/SocialContentPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceVND, isDataUrl } from "@/lib/utils";

export default function AdminProductsPage() {
  const { bikes, toggleBikeActive, deleteBike: removeBikeFromStore } =
    useBikes();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<BikeCategory | "all">(
    "all"
  );
  const [socialBike, setSocialBike] = useState<Bike | null>(null);

  const filteredBikes = useMemo(() => {
    return bikes
      .filter((bike) =>
        categoryFilter === "all" ? true : bike.category === categoryFilter
      )
      .filter((bike) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          bike.name.toLowerCase().includes(q) ||
          bike.brand.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [bikes, search, categoryFilter]);

  const handleDeleteBike = (bike: Bike) => {
    const confirmed = window.confirm(
      `Xóa hẳn "${bike.name}" khỏi hệ thống? Xe cũ độc bản, hành động này không thể hoàn tác.`
    );
    if (!confirmed) return;
    removeBikeFromStore(bike.id);
  };

  const openSocialGenerator = (bike: Bike) => {
    setSocialBike(bike);
  };

  const activeCount = bikes.filter((b) => b.isActive).length;
  const hiddenCount = bikes.length - activeCount;

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
        <p className="text-sm text-muted-foreground">
          Bật/tắt hiển thị, xóa xe đã bán, và tạo nội dung đăng bán bằng AI.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-2xl">{bikes.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
            Tổng sản phẩm
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-2xl text-green-600">
              {activeCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
            Đang hiển thị
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-2xl text-muted-foreground">
              {hiddenCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
            Đã ẩn khỏi web
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên xe, thương hiệu..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value) =>
            setCategoryFilter(value as BikeCategory | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {Object.values(BIKE_CATEGORIES).map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản Phẩm</TableHead>
              <TableHead>Danh Mục</TableHead>
              <TableHead>Nguồn Hàng</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn Kho</TableHead>
              <TableHead>Hiển Thị Trên Web</TableHead>
              <TableHead>Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBikes.map((bike) => (
              <TableRow key={bike.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={bike.thumbnail}
                        alt={bike.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={isDataUrl(bike.thumbnail)}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{bike.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {bike.brand} · {bike.productType}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {BIKE_CATEGORIES[bike.category].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <SourceBadge source={bike.source} />
                </TableCell>
                <TableCell>{formatPriceVND(bike.price)}</TableCell>
                <TableCell>
                  {bike.stock > 0 ? (
                    bike.stock
                  ) : (
                    <span className="text-red-600">Hết xe</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={bike.isActive}
                      onCheckedChange={() => toggleBikeActive(bike.id)}
                      aria-label={`Bật/tắt hiển thị ${bike.name}`}
                    />
                    <span
                      className={
                        bike.isActive
                          ? "text-sm font-medium text-green-600"
                          : "text-sm font-medium text-muted-foreground"
                      }
                    >
                      {bike.isActive ? "Đang hiển thị" : "Đã ẩn"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openSocialGenerator(bike)}
                    >
                      <Megaphone className="h-3.5 w-3.5" />
                      Nội Dung AI
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBike(bike)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa Xe
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredBikes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Không tìm thấy sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={socialBike !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSocialBike(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              AI Social Content Generator
            </DialogTitle>
            <DialogDescription>
              Nội dung được AI tự động sinh cho{" "}
              <strong>{socialBike?.name}</strong>. Kiểm tra lại trước khi đăng.
            </DialogDescription>
          </DialogHeader>

          {socialBike && (
            <div className="max-h-[60vh] overflow-y-auto">
              <SocialContentPanel bike={socialBike} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
