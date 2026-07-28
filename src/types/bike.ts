export type BikeSource = "thanh-ly" | "xa-kho" | "trung-bay";

export interface BikeSourceInfo {
  value: BikeSource;
  label: string;
  description: string;
}

export const BIKE_SOURCES: Record<BikeSource, BikeSourceInfo> = {
  "thanh-ly": {
    value: "thanh-ly",
    label: "Thanh Lý",
    description: "Xe đã qua sử dụng, thanh lý giá tốt",
  },
  "xa-kho": {
    value: "xa-kho",
    label: "Xả Kho",
    description: "Xe mới 100%, xả kho số lượng lớn",
  },
  "trung-bay": {
    value: "trung-bay",
    label: "Trưng Bày",
    description: "Xe trưng bày tại showroom, mới 99%",
  },
};

export type BikeCategory = "KIDS" | "STANDARD" | "SPORTS";

export interface BikeCategoryInfo {
  value: BikeCategory;
  label: string;
  description: string;
}

export const BIKE_CATEGORIES: Record<BikeCategory, BikeCategoryInfo> = {
  SPORTS: {
    value: "SPORTS",
    label: "Xe Đạp Thể Thao",
    description: "Xe địa hình, đua, touring hiệu suất cao",
  },
  STANDARD: {
    value: "STANDARD",
    label: "Xe Đạp Thông Dụng",
    description: "Xe đi làm, đi học, di chuyển hàng ngày",
  },
  KIDS: {
    value: "KIDS",
    label: "Xe Đạp Trẻ Em",
    description: "Xe đạp dành cho các bé, nhiều size khác nhau",
  },
};

export const BIKE_CATEGORY_ORDER: BikeCategory[] = [
  "SPORTS",
  "STANDARD",
  "KIDS",
];

export type BikeCondition = "moi-100" | "moi-99" | "da-qua-su-dung";

export const BIKE_CONDITION_LABELS: Record<BikeCondition, string> = {
  "moi-100": "Mới 100%, chưa qua sử dụng",
  "moi-99": "Xe trưng bày, mới 99%",
  "da-qua-su-dung": "Đã qua sử dụng",
};

export interface Bike {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Loại xe cụ thể để hiển thị (VD: "Xe Đạp Địa Hình", "Xe Đạp Gấp") */
  productType: string;
  category: BikeCategory;
  source: BikeSource;
  condition: BikeCondition;
  originalPrice: number;
  price: number;
  discountPercent: number;
  stock: number;
  images: string[];
  thumbnail: string;
  description: string;
  specs: Record<string, string>;
  location: string;
  isFeatured?: boolean;
  /** false = ẩn khỏi web (hết xe / ngừng theo dõi) */
  isActive: boolean;
  /** Chiều cao người lái tối thiểu phù hợp (cm) */
  heightMin: number;
  /** Chiều cao người lái tối đa phù hợp (cm) */
  heightMax: number;
  createdAt: string;
}
