"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Clock, MessageCircle, Phone, Search } from "lucide-react";

import { mockOrders } from "@/data/mockOrders";
import { Order, ORDER_STATUSES, OrderStatus } from "@/types/order";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceVND, toZaloLink } from "@/lib/utils";

const SLA_MINUTES = 15;

function SlaBadge({ createdAt, now }: { createdAt: string; now: number | null }) {
  if (now === null) {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        Đang tính...
      </span>
    );
  }

  const elapsedMs = now - new Date(createdAt).getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const remaining = SLA_MINUTES - elapsedMinutes;

  if (remaining > 0) {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
        <Clock className="h-3.5 w-3.5" />
        Còn {remaining} phút
      </span>
    );
  }

  return (
    <span className="inline-flex animate-pulse items-center gap-1 whitespace-nowrap rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
      <AlertTriangle className="h-3.5 w-3.5" />
      QUÁ HẠN {Math.abs(remaining)} phút
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) =>
        statusFilter === "all" ? true : order.status === statusFilter
      )
      .filter((order) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          order.customerName.toLowerCase().includes(q) ||
          order.customerPhone.includes(q) ||
          order.bikeName.toLowerCase().includes(q) ||
          (order.address?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [orders, search, statusFilter]);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const newOrdersCount = orders.filter((o) => o.status === "moi").length;
  const overdueCount =
    now === null
      ? 0
      : orders.filter(
          (o) =>
            o.status === "moi" &&
            SLA_MINUTES -
              Math.floor((now - new Date(o.createdAt).getTime()) / 60000) <=
              0
        ).length;

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Quản Lý Đơn Hàng (CRM)</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi và xử lý các đơn giữ xe từ khách hàng.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-2xl">{orders.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
            Tổng đơn hàng
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-2xl text-orange-600">
              {newOrdersCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
            Đơn mới cần xử lý
          </CardContent>
        </Card>
        <Card className={overdueCount > 0 ? "border-red-300 bg-red-50" : ""}>
          <CardHeader className="p-4 pb-0">
            <CardTitle
              className={
                overdueCount > 0 ? "text-2xl text-red-600" : "text-2xl"
              }
            >
              {overdueCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-sm text-muted-foreground">
            Đơn quá hạn 15 phút chưa gọi
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT, tên xe..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {Object.values(ORDER_STATUSES).map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Số Điện Thoại</TableHead>
              <TableHead>Địa Chỉ</TableHead>
              <TableHead>Xe Đặt</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Thời Gian</TableHead>
              <TableHead>Nhắc Nhở</TableHead>
              <TableHead>Trạng Thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.customerName}
                  {order.note && (
                    <p className="text-xs font-normal text-muted-foreground">
                      {order.note}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {order.customerPhone}
                    </a>
                    <a
                      href={toZaloLink(order.customerPhone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Gõ Nhanh Zalo
                    </a>
                  </div>
                </TableCell>
                <TableCell className="max-w-[160px] text-sm text-muted-foreground">
                  {order.address || "—"}
                </TableCell>
                <TableCell>{order.bikeName}</TableCell>
                <TableCell>{formatPriceVND(order.bikePrice)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>
                  {order.status === "moi" ? (
                    <SlaBadge createdAt={order.createdAt} now={now} />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      updateStatus(order.id, value as OrderStatus)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue>
                        <Badge className={ORDER_STATUSES[order.status].color}>
                          {ORDER_STATUSES[order.status].label}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ORDER_STATUSES).map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}

            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
