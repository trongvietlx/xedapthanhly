export type OrderStatus =
  | "moi"
  | "da-lien-he"
  | "xac-nhan"
  | "da-giao"
  | "huy";

export interface OrderStatusInfo {
  value: OrderStatus;
  label: string;
  color: string;
}

export const ORDER_STATUSES: Record<OrderStatus, OrderStatusInfo> = {
  moi: { value: "moi", label: "Đơn Mới", color: "bg-orange-100 text-orange-700" },
  "da-lien-he": {
    value: "da-lien-he",
    label: "Đã Liên Hệ",
    color: "bg-blue-100 text-blue-700",
  },
  "xac-nhan": {
    value: "xac-nhan",
    label: "Đã Xác Nhận",
    color: "bg-purple-100 text-purple-700",
  },
  "da-giao": {
    value: "da-giao",
    label: "Đã Giao Xe",
    color: "bg-green-100 text-green-700",
  },
  huy: { value: "huy", label: "Đã Hủy", color: "bg-red-100 text-red-700" },
};

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  bikeId: string;
  bikeName: string;
  bikePrice: number;
  note?: string;
  status: OrderStatus;
  createdAt: string;
}
