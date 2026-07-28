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

export type BikeCondition = "moi-100" | "moi-99" | "da-qua-su-dung";

export interface Bike {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
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
  createdAt: string;
}
