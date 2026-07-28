import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { FacebookPixel } from "@/components/FacebookPixel";

export const metadata: Metadata = {
  title: "Xe Đạp Thanh Lý - Xả Kho & Trưng Bày Chính Hãng",
  description:
    "Chuyên xe đạp thanh lý, xả kho, xe trưng bày chính hãng - Giá tốt nhất thị trường, giữ xe nhanh chỉ với 1 phút.",
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">
        {children}
        <FacebookPixel />
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
