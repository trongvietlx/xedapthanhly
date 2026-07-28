import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceVND(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function toZaloLink(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  const normalized = digitsOnly.startsWith("0")
    ? `84${digitsOnly.slice(1)}`
    : digitsOnly;
  return `https://zalo.me/${normalized}`;
}
