import { Bike } from "@/types/bike";

export const mockBikes: Bike[] = [
  {
    id: "b1",
    slug: "giant-escape-3-xa-kho-2024",
    name: "Giant Escape 3",
    brand: "Giant",
    category: "Xe Đạp Thể Thao",
    source: "xa-kho",
    condition: "moi-100",
    originalPrice: 8900000,
    price: 6200000,
    discountPercent: 30,
    stock: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&q=80",
    ],
    description:
      "Giant Escape 3 nguyên đai nguyên kiện, xả kho số lượng lớn do đại lý thu hẹp quy mô. Khung nhôm ALUXX nhẹ, phù hợp đi phố và tập luyện.",
    specs: {
      "Khung xe": "Nhôm ALUXX",
      "Bộ truyền động": "Shimano 24 tốc độ",
      "Phanh": "Disc cơ",
      "Kích thước bánh": "700c",
      "Trọng lượng": "11.8 kg",
    },
    location: "Kho Bình Dương",
    isFeatured: true,
    createdAt: "2026-07-20",
  },
  {
    id: "b2",
    slug: "trek-marlin-5-thanh-ly",
    name: "Trek Marlin 5",
    brand: "Trek",
    category: "Xe Đạp Địa Hình",
    source: "thanh-ly",
    condition: "da-qua-su-dung",
    originalPrice: 12500000,
    price: 7500000,
    discountPercent: 40,
    stock: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1200&q=80",
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=1200&q=80",
    ],
    description:
      "Trek Marlin 5 thanh lý từ khách hàng đi lướt, xe còn rất mới, đầy đủ giấy tờ, đã được kiểm tra bảo dưỡng toàn bộ trước khi lên kệ.",
    specs: {
      "Khung xe": "Alpha Silver Aluminum",
      "Bộ truyền động": "Shimano 21 tốc độ",
      "Phanh": "Disc dầu",
      "Kích thước bánh": "29 inch",
      "Trọng lượng": "13.5 kg",
    },
    location: "Showroom Quận 7, TP.HCM",
    isFeatured: true,
    createdAt: "2026-07-18",
  },
  {
    id: "b3",
    slug: "giant-tcr-advanced-trung-bay",
    name: "Giant TCR Advanced",
    brand: "Giant",
    category: "Xe Đạp Đua",
    source: "trung-bay",
    condition: "moi-99",
    originalPrice: 45000000,
    price: 34900000,
    discountPercent: 22,
    stock: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
    ],
    description:
      "Xe trưng bày tại showroom, chỉ chạy demo thử vài km, ngoại hình như mới 99%, đầy đủ hộp và phụ kiện đi kèm.",
    specs: {
      "Khung xe": "Carbon Advanced-Grade Composite",
      "Bộ truyền động": "Shimano 105 22 tốc độ",
      "Phanh": "Disc dầu",
      "Kích thước bánh": "700c",
      "Trọng lượng": "8.9 kg",
    },
    location: "Showroom Quận 1, TP.HCM",
    isFeatured: true,
    createdAt: "2026-07-25",
  },
  {
    id: "b4",
    slug: "asama-fld-nhom-xa-kho",
    name: "Asama FLD 2701",
    brand: "Asama",
    category: "Xe Đạp Gấp",
    source: "xa-kho",
    condition: "moi-100",
    originalPrice: 3200000,
    price: 2100000,
    discountPercent: 34,
    stock: 25,
    thumbnail:
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=1200&q=80",
    ],
    description:
      "Xe đạp gấp gọn tiện lợi, xả kho số lượng lớn, thích hợp di chuyển trong thành phố và gấp gọn mang lên xe khách, tàu điện.",
    specs: {
      "Khung xe": "Thép hợp kim",
      "Bộ truyền động": "Shimano 6 tốc độ",
      "Phanh": "V-brake",
      "Kích thước bánh": "20 inch",
      "Trọng lượng": "13 kg",
    },
    location: "Kho Bình Dương",
    createdAt: "2026-07-15",
  },
  {
    id: "b5",
    slug: "specialized-rockhopper-thanh-ly",
    name: "Specialized Rockhopper",
    brand: "Specialized",
    category: "Xe Đạp Địa Hình",
    source: "thanh-ly",
    condition: "da-qua-su-dung",
    originalPrice: 15900000,
    price: 9900000,
    discountPercent: 38,
    stock: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1544191696-102152dfe6c8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544191696-102152dfe6c8?w=1200&q=80",
    ],
    description:
      "Specialized Rockhopper chính hãng, thanh lý từ CLB đạp xe, xe đi kỹ, bảo dưỡng định kỳ, sẵn sàng lăn bánh ngay.",
    specs: {
      "Khung xe": "A1 Premium Aluminum",
      "Bộ truyền động": "Shimano 24 tốc độ",
      "Phanh": "Disc cơ",
      "Kích thước bánh": "29 inch",
      "Trọng lượng": "13.2 kg",
    },
    location: "Showroom Quận 7, TP.HCM",
    createdAt: "2026-07-10",
  },
  {
    id: "b6",
    slug: "martin94-touring-trung-bay",
    name: "Martin94 Touring Classic",
    brand: "Martin94",
    category: "Xe Đạp Touring",
    source: "trung-bay",
    condition: "moi-99",
    originalPrice: 6500000,
    price: 4900000,
    discountPercent: 25,
    stock: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&q=80",
    ],
    description:
      "Xe touring phong cách cổ điển, trưng bày tại cửa hàng, thiết kế thanh lịch phù hợp đi làm, dạo phố.",
    specs: {
      "Khung xe": "Thép Cr-Mo",
      "Bộ truyền động": "Shimano 7 tốc độ",
      "Phanh": "V-brake",
      "Kích thước bánh": "700c",
      "Trọng lượng": "12.5 kg",
    },
    location: "Showroom Quận 1, TP.HCM",
    createdAt: "2026-07-22",
  },
];

export function getBikeBySlug(slug: string): Bike | undefined {
  return mockBikes.find((bike) => bike.slug === slug);
}
