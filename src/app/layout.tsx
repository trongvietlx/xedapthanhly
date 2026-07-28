import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xe Đạp Thanh Lý - Xả Kho & Trưng Bày Chính Hãng",
  description:
    "Chuyên xe đạp thanh lý, xả kho, xe trưng bày chính hãng - Giá tốt nhất thị trường, giữ xe nhanh chỉ với 1 phút.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
