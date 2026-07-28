"use client";

import { useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Sparkles, Upload } from "lucide-react";

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
import { BIKE_SOURCES } from "@/types/bike";
import { formatPriceVND } from "@/lib/utils";

interface AiListingDraft {
  name: string;
  brand: string;
  category: string;
  condition: string;
  price: number;
  description: string;
  source: string;
}

const SAMPLE_DRAFTS: AiListingDraft[] = [
  {
    name: "Giant Escape 3 Nhôm ALUXX",
    brand: "Giant",
    category: "Xe Đạp Thể Thao",
    condition: "Mới 100%",
    price: 6200000,
    description:
      "Xe đạp thể thao khung nhôm ALUXX nhẹ, phù hợp đi phố và tập luyện thể thao hàng ngày. Bộ truyền động Shimano 24 tốc độ, phanh đĩa cơ an toàn.",
    source: "xa-kho",
  },
  {
    name: "Trek Marlin 5 Địa Hình",
    brand: "Trek",
    category: "Xe Đạp Địa Hình",
    condition: "Đã qua sử dụng - 95%",
    price: 7500000,
    description:
      "Xe địa hình Trek Marlin 5, khung Alpha Silver Aluminum bền bỉ, phanh đĩa dầu, phù hợp off-road nhẹ và di chuyển đường phố.",
    source: "thanh-ly",
  },
];

type Stage = "upload" | "analyzing" | "review" | "published";

export default function AutoListingPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("upload");
  const [draft, setDraft] = useState<AiListingDraft | null>(null);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setStage("upload");
    setDraft(null);
  };

  const handleAnalyze = () => {
    if (!imagePreview) return;
    setStage("analyzing");

    setTimeout(() => {
      const sample =
        SAMPLE_DRAFTS[Math.floor(Math.random() * SAMPLE_DRAFTS.length)];
      setDraft(sample);
      setStage("review");
    }, 1800);
  };

  const handlePublish = () => {
    setStage("published");
  };

  const handleReset = () => {
    setImagePreview(null);
    setDraft(null);
    setStage("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Auto-Listing
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload ảnh xe đạp, AI sẽ tự động nhận diện và điền thông tin sản
          phẩm để lên bài nhanh chóng.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Upload Ảnh Xe</CardTitle>
            <CardDescription>
              Chọn ảnh rõ nét, đủ ánh sáng để AI nhận diện chính xác nhất.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-muted/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Ảnh xe đạp đã upload"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <ImagePlus className="h-10 w-10" />
                  <span className="text-sm font-medium">
                    Nhấn để chọn ảnh xe đạp
                  </span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />

            <Button
              onClick={handleAnalyze}
              disabled={!imagePreview || stage === "analyzing"}
              size="lg"
            >
              {stage === "analyzing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI đang phân tích ảnh...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Phân Tích Bằng AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              2. Xác Nhận Thông Tin &amp; Đăng Bài
            </CardTitle>
            <CardDescription>
              AI đã điền sẵn thông tin, bạn kiểm tra và chỉnh sửa trước khi
              đăng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stage === "upload" || stage === "analyzing" ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Sparkles className="h-8 w-8 opacity-40" />
                {stage === "analyzing"
                  ? "AI đang nhận diện thương hiệu, dòng xe và tình trạng..."
                  : "Upload ảnh và nhấn \"Phân Tích Bằng AI\" để bắt đầu."}
              </div>
            ) : stage === "published" ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                <CheckCircle2 className="h-14 w-14 text-green-600" />
                <p className="text-lg font-semibold">Đã Đăng Bài Thành Công!</p>
                <p className="text-sm text-muted-foreground">
                  Sản phẩm &quot;{draft?.name}&quot; đã được thêm vào cửa hàng.
                </p>
                <Button variant="outline" onClick={handleReset}>
                  Đăng Sản Phẩm Khác
                </Button>
              </div>
            ) : (
              draft && (
                <div className="flex flex-col gap-4">
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
                      <Input
                        id="ai-category"
                        value={draft.category}
                        onChange={(e) =>
                          setDraft({ ...draft, category: e.target.value })
                        }
                      />
                    </div>
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
                          setDraft({ ...draft, source: value })
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
                    <Label htmlFor="ai-condition">Tình Trạng</Label>
                    <Input
                      id="ai-condition"
                      value={draft.condition}
                      onChange={(e) =>
                        setDraft({ ...draft, condition: e.target.value })
                      }
                    />
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

                  <Button size="lg" onClick={handlePublish}>
                    <CheckCircle2 className="h-4 w-4" />
                    Đăng Bài Ngay
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
