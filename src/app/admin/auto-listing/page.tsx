"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBikes } from "@/context/BikeContext";
import {
  Bike,
  BIKE_CATEGORIES,
  BIKE_SOURCES,
  BikeCategory,
  BikeCondition,
  BikeSource,
  DEFAULT_HEIGHT_RANGE_BY_CATEGORY,
} from "@/types/bike";
import { cn, formatPriceVND, slugify } from "@/lib/utils";

interface UploadedImage {
  id: string;
  file: File;
  url: string;
}

interface AiListingDraft {
  name: string;
  brand: string;
  category: BikeCategory;
  productType: string;
  configuration: string;
  conditionPercent: number;
  scratches: string;
  price: number;
  source: BikeSource;
  location: string;
  description: string;
}

interface AnalysisTemplate {
  name: string;
  brand: string;
  category: BikeCategory;
  productType: string;
  configuration: string;
  basePrice: number;
  source: BikeSource;
  location: string;
  descriptionBase: string;
}

const ANALYSIS_TEMPLATES: AnalysisTemplate[] = [
  {
    name: "Giant Escape 3",
    brand: "Giant",
    category: "SPORTS",
    productType: "Xe Đạp Thể Thao",
    configuration:
      "Khung nhôm ALUXX, bộ truyền động Shimano 24 tốc độ, phanh đĩa cơ, bánh 700c",
    basePrice: 6200000,
    source: "xa-kho",
    location: "Kho Bình Dương",
    descriptionBase:
      "Xe đạp thể thao khung nhôm nhẹ, phù hợp đi phố và tập luyện thể thao hàng ngày.",
  },
  {
    name: "Trek Marlin 5",
    brand: "Trek",
    category: "SPORTS",
    productType: "Xe Đạp Địa Hình",
    configuration:
      "Khung Alpha Silver Aluminum, Shimano 21 tốc độ, phanh đĩa dầu, bánh 29 inch",
    basePrice: 7500000,
    source: "thanh-ly",
    location: "Showroom Quận 7, TP.HCM",
    descriptionBase:
      "Xe địa hình bền bỉ, phù hợp off-road nhẹ và di chuyển đường phố hàng ngày.",
  },
  {
    name: "Asama FLD 2701",
    brand: "Asama",
    category: "FOLDING",
    productType: "Xe Đạp Gấp",
    configuration:
      "Khung thép hợp kim, Shimano 6 tốc độ, phanh V-brake, bánh 20 inch",
    basePrice: 2100000,
    source: "xa-kho",
    location: "Kho Bình Dương",
    descriptionBase:
      "Xe đạp gấp gọn tiện lợi, thích hợp di chuyển trong thành phố và mang lên xe khách.",
  },
  {
    name: "Royal Baby 16 inch",
    brand: "Royal Baby",
    category: "KIDS",
    productType: "Xe Đạp Trẻ Em",
    configuration:
      "Khung thép hợp kim cao cấp, bánh 16 inch, có bánh phụ tháo lắp, phanh đùi + phanh tay",
    basePrice: 1890000,
    source: "xa-kho",
    location: "Kho Bình Dương",
    descriptionBase:
      "Xe đạp trẻ em an toàn, khung nhỏ gọn, phù hợp bé 4-7 tuổi.",
  },
  {
    name: "Asama EBike Trend",
    brand: "Asama",
    category: "ELECTRIC",
    productType: "Xe Đạp Điện",
    configuration:
      "Động cơ 250W trợ lực, pin Lithium 36V 10Ah, phanh đĩa cơ, bánh 24 inch",
    basePrice: 8900000,
    source: "xa-kho",
    location: "Kho Bình Dương",
    descriptionBase:
      "Xe đạp điện trợ lực êm ái, hỗ trợ đi xa không tốn sức, phù hợp đi làm, đi học hàng ngày.",
  },
];

function analyzeAdminNotes(notes: string): {
  conditionPercent: number;
  scratches: string;
  noteSummary: string;
} {
  const lower = notes.toLowerCase();
  let conditionPercent = 95;
  const scratchNotes: string[] = [];

  if (
    lower.includes("mới 100") ||
    lower.includes("chưa qua sử dụng") ||
    lower.includes("nguyên hộp") ||
    lower.includes("nguyên seal")
  ) {
    conditionPercent = 100;
  }
  if (lower.includes("xước") || lower.includes("trầy")) {
    conditionPercent -= 8;
    scratchNotes.push("Có vết xước nhẹ theo mô tả của admin");
  }
  if (
    lower.includes("cũ") ||
    lower.includes("đã dùng") ||
    lower.includes("đã qua sử dụng")
  ) {
    conditionPercent -= 15;
  }
  if (lower.includes("móp") || lower.includes("gỉ") || lower.includes("rỉ sét")) {
    conditionPercent -= 12;
    scratchNotes.push("Ghi nhận móp/gỉ sét nhẹ theo mô tả của admin");
  }
  if (
    lower.includes("thay") ||
    lower.includes("bảo dưỡng") ||
    lower.includes("bảo trì")
  ) {
    scratchNotes.push("Đã được thay thế/bảo dưỡng một số phụ tùng theo ghi chú admin");
  }

  conditionPercent = Math.max(50, Math.min(100, conditionPercent));

  const scratches =
    scratchNotes.length > 0
      ? scratchNotes.join(". ") + "."
      : "Ngoại hình còn tốt, không ghi nhận lỗi đáng kể qua ảnh.";

  const noteSummary = notes.trim()
    ? `Ghi chú admin: "${notes.trim()}".`
    : "";

  return { conditionPercent, scratches, noteSummary };
}

type Stage = "input" | "analyzing" | "review";

function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  return fetch(blobUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        })
    );
}

function conditionPercentToBikeCondition(conditionPercent: number): BikeCondition {
  if (conditionPercent >= 100) return "moi-100";
  if (conditionPercent >= 95) return "moi-99";
  return "da-qua-su-dung";
}

export default function AutoListingPage() {
  const router = useRouter();
  const { addBike } = useBikes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [stage, setStage] = useState<Stage>("input");
  const [draft, setDraft] = useState<AiListingDraft | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const newImages: UploadedImage[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileInputChange = (fileList: FileList | null) => {
    if (!fileList) return;
    addFiles(fileList);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleAnalyze = () => {
    if (images.length === 0) return;
    setStage("analyzing");

    setTimeout(() => {
      const template =
        ANALYSIS_TEMPLATES[Math.floor(Math.random() * ANALYSIS_TEMPLATES.length)];
      const { conditionPercent, scratches, noteSummary } =
        analyzeAdminNotes(adminNotes);

      setDraft({
        name: template.name,
        brand: template.brand,
        category: template.category,
        productType: template.productType,
        configuration: template.configuration,
        conditionPercent,
        scratches,
        price: template.basePrice,
        source: template.source,
        location: template.location,
        description: [template.descriptionBase, noteSummary]
          .filter(Boolean)
          .join(" "),
      });

      setThumbnail(images[0].url);
      setGallery(images.slice(1).map((img) => img.url));
      setStage("review");
    }, 2000);
  };

  const handlePublish = async () => {
    if (!draft || !thumbnail) return;

    setIsPublishing(true);
    setPublishError("");

    try {
      const [persistedThumbnail, ...persistedGallery] = await Promise.all(
        [thumbnail, ...gallery].map(blobUrlToDataUrl)
      );

      const heightRange = DEFAULT_HEIGHT_RANGE_BY_CATEGORY[draft.category];
      const now = Date.now();

      const newBike: Bike = {
        id: crypto.randomUUID(),
        slug: `${slugify(draft.name)}-${now}`,
        name: draft.name,
        brand: draft.brand,
        productType: draft.productType,
        category: draft.category,
        source: draft.source,
        condition: conditionPercentToBikeCondition(draft.conditionPercent),
        originalPrice: draft.price,
        price: draft.price,
        discountPercent: 0,
        stock: 1,
        images: [persistedThumbnail, ...persistedGallery],
        thumbnail: persistedThumbnail,
        description: draft.description,
        specs: {
          "Cấu hình": draft.configuration,
          "Tình trạng ngoại quan": draft.scratches,
        },
        location: draft.location,
        isActive: true,
        heightMin: heightRange.heightMin,
        heightMax: heightRange.heightMax,
        createdAt: new Date(now).toISOString(),
      };

      addBike(newBike);
      images.forEach((img) => URL.revokeObjectURL(img.url));
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to publish bike:", error);
      setPublishError(
        "Có lỗi xảy ra khi lưu sản phẩm, vui lòng thử lại."
      );
      setIsPublishing(false);
    }
  };

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Auto-Listing
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload nhiều ảnh xe đạp kèm ghi chú, AI sẽ tự động nhận diện và điền
          thông tin sản phẩm để lên bài nhanh chóng.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Bước 1: Nhập Liệu Cho AI
            </CardTitle>
            <CardDescription>
              Upload nhiều ảnh (ảnh đầu tiên sẽ là ảnh đại diện) và ghi chú
              thêm để AI phân tích chính xác hơn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              className={cn(
                "flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-muted/40 p-6 text-center text-muted-foreground transition-colors hover:border-primary hover:text-primary",
                isDragOver && "border-primary bg-primary/5 text-primary"
              )}
            >
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm font-medium">
                Kéo thả ảnh vào đây hoặc nhấn để chọn (có thể chọn nhiều ảnh)
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileInputChange(e.target.files)}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={img.url}
                      alt={`Ảnh xe đạp ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {index === 0 && (
                      <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        <Star className="h-2.5 w-2.5" />
                        Đại diện
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Xóa ảnh"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-notes">Ghi Chú Thêm Cho AI (tùy chọn)</Label>
              <Textarea
                id="admin-notes"
                rows={3}
                placeholder='VD: "Xe mua năm ngoái, đã thay xích, xước nhẹ ở yên"'
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={images.length === 0 || stage === "analyzing"}
              size="lg"
            >
              {stage === "analyzing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI Đang Phân Tích...
                </>
              ) : (
                "🤖 AI Bắt Đầu Phân Tích & Lên Bài"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Bước 2 &amp; 3: Kết Quả Phân Tích &amp; Đăng Bài
            </CardTitle>
            <CardDescription>
              AI đã điền sẵn thông tin, bạn kiểm tra và chỉnh sửa trước khi
              đăng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stage === "input" || stage === "analyzing" ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                {stage === "analyzing" ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    AI đang phân tích {images.length} ảnh
                    {adminNotes.trim() ? " và ghi chú của bạn" : ""}...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-8 w-8 opacity-40" />
                    Upload ảnh và nhấn &quot;AI Bắt Đầu Phân Tích &amp; Lên
                    Bài&quot; để bắt đầu.
                  </>
                )}
              </div>
            ) : (
              draft && (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                      {thumbnail && (
                        <Image
                          src={thumbnail}
                          alt="Ảnh đại diện"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white">
                        Ảnh đại diện
                      </span>
                    </div>
                    {gallery.length > 0 && (
                      <div className="flex flex-1 gap-2 overflow-x-auto">
                        {gallery.map((url) => (
                          <div
                            key={url}
                            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border"
                          >
                            <Image
                              src={url}
                              alt="Ảnh gallery"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="ai-name">Tên Sản Phẩm</Label>
                    <Input
                      id="ai-name"
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ai-brand">Thương Hiệu</Label>
                      <Input
                        id="ai-brand"
                        value={draft.brand}
                        onChange={(e) =>
                          setDraft({ ...draft, brand: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ai-category">Danh Mục</Label>
                      <Select
                        value={draft.category}
                        onValueChange={(value) =>
                          setDraft({ ...draft, category: value as BikeCategory })
                        }
                      >
                        <SelectTrigger id="ai-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BIKE_CATEGORIES).map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="ai-config">Cấu Hình</Label>
                    <Input
                      id="ai-config"
                      value={draft.configuration}
                      onChange={(e) =>
                        setDraft({ ...draft, configuration: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ai-price">Giá Bán (VNĐ)</Label>
                      <Input
                        id="ai-price"
                        type="number"
                        value={draft.price}
                        onChange={(e) =>
                          setDraft({ ...draft, price: Number(e.target.value) })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatPriceVND(draft.price)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ai-source">Nguồn Hàng</Label>
                      <Select
                        value={draft.source}
                        onValueChange={(value) =>
                          setDraft({ ...draft, source: value as BikeSource })
                        }
                      >
                        <SelectTrigger id="ai-source">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BIKE_SOURCES).map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="ai-location">Địa Chỉ / Kho Xe</Label>
                    <Input
                      id="ai-location"
                      value={draft.location}
                      onChange={(e) =>
                        setDraft({ ...draft, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ai-condition-percent">
                        % Độ Mới
                      </Label>
                      <Input
                        id="ai-condition-percent"
                        type="number"
                        min={0}
                        max={100}
                        value={draft.conditionPercent}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            conditionPercent: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="ai-scratches">Vết Trầy Xước</Label>
                      <Input
                        id="ai-scratches"
                        value={draft.scratches}
                        onChange={(e) =>
                          setDraft({ ...draft, scratches: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="ai-description">Mô Tả Sản Phẩm</Label>
                    <Textarea
                      id="ai-description"
                      rows={4}
                      value={draft.description}
                      onChange={(e) =>
                        setDraft({ ...draft, description: e.target.value })
                      }
                    />
                  </div>

                  {publishError && (
                    <p className="text-sm text-destructive">{publishError}</p>
                  )}

                  <Button size="lg" onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang Đăng Bài...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Đăng Sản Phẩm
                      </>
                    )}
                  </Button>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
