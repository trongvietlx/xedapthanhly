import { Bike, BIKE_CATEGORIES, BIKE_CONDITION_LABELS, BIKE_SOURCES } from "@/types/bike";
import { formatPriceVND } from "@/lib/utils";

function slugifyHashtag(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .replace(/[^a-zA-Z0-9]/g, "");
}

function buildDefectNote(bike: Bike): string {
  if (bike.condition === "moi-100") {
    return "Xe còn nguyên hộp/tem, chưa qua sử dụng, không trầy xước.";
  }
  if (bike.condition === "moi-99") {
    return "Xe trưng bày tại showroom, ngoại hình như mới, có thể có vài vết chạm rất nhỏ do trưng bày, không ảnh hưởng vận hành.";
  }
  return "Xe đã qua sử dụng, có thể có trầy xước nhẹ theo thời gian dùng, khung sườn và hệ truyền động vẫn hoạt động tốt, khách xem trực tiếp trước khi nhận.";
}

export function generateFacebookPost(bike: Bike): string {
  const discountLine =
    bike.discountPercent > 0
      ? `💥 GIẢM ${bike.discountPercent}% - Chỉ ${formatPriceVND(bike.price)} (giá gốc ${formatPriceVND(bike.originalPrice)})`
      : `💥 Giá chỉ ${formatPriceVND(bike.price)}`;

  const stockLine =
    bike.stock > 0
      ? `⚠️ Kho chỉ còn ${bike.stock} chiếc - Ai nhanh tay người đó có!`
      : `⚠️ Xe độc bản - bán xong là hết, không còn hàng bổ sung!`;

  const hashtags = [
    "xedapthanhly",
    "xakho",
    slugifyHashtag(bike.brand),
    slugifyHashtag(BIKE_CATEGORIES[bike.category].label),
    "xedapcu",
  ]
    .filter(Boolean)
    .map((tag) => `#${tag}`)
    .join(" ");

  return `🔥🔥 XẢ KHO GẤP - ${bike.name.toUpperCase()} 🔥🔥

${discountLine}
🚲 ${bike.brand} - ${bike.productType}
📦 Nguồn hàng: ${BIKE_SOURCES[bike.source].label}
${stockLine}
📍 Xem xe tại: ${bike.location}

👉 Inbox hoặc để lại SỐ ĐIỆN THOẠI ngay để được giữ xe FREE, không cần cọc trước!
☎️ Gọi ngay hotline để được tư vấn nhanh nhất.

${hashtags}`;
}

export function generateChoTotPost(bike: Bike): string {
  const specLines = Object.entries(bike.specs)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");

  return `Bán ${bike.name} - ${bike.brand}

Giá bán: ${formatPriceVND(bike.price)}${
    bike.originalPrice > bike.price
      ? ` (giá niêm yết ${formatPriceVND(bike.originalPrice)})`
      : ""
  }
Danh mục: ${BIKE_CATEGORIES[bike.category].label} (${bike.productType})
Nguồn gốc: ${BIKE_SOURCES[bike.source].label}
Tình trạng: ${BIKE_CONDITION_LABELS[bike.condition]}
Tình trạng ngoại quan: ${buildDefectNote(bike)}

Thông số kỹ thuật:
${specLines}

Mô tả chi tiết: ${bike.description}

Số lượng còn lại: ${bike.stock > 0 ? `${bike.stock} chiếc` : "xe độc bản, bán xong là hết"}
Địa chỉ xem xe: ${bike.location}
Hỗ trợ xem xe trực tiếp, kiểm tra thoải mái trước khi thanh toán.`;
}

export interface SocialContent {
  facebookPost: string;
  choTotPost: string;
}

export function generateSocialContent(bike: Bike): SocialContent {
  return {
    facebookPost: generateFacebookPost(bike),
    choTotPost: generateChoTotPost(bike),
  };
}
