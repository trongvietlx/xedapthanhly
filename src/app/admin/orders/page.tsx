"use client";

import { useMemo, useState } from "react";
import { Phone, Search } from "lucide-react";

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
import { formatPriceVND } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

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
          order.bikeName.toLowerCase().includes(q)
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

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Quản Lý Đơn Hàng (CRM)</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi và xử lý các đơn giữ xe từ khách hàng.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              <TableHead>Xe Đặt</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Thời Gian</TableHead>
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
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {order.customerPhone}
                  </a>
                </TableCell>
                <TableCell>{order.bikeName}</TableCell>
                <TableCell>{formatPriceVND(order.bikePrice)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
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
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
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
