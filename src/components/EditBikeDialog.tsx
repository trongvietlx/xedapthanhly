"use client";

import { useState } from "react";

import { useBikes } from "@/context/BikeContext";
import {
  Bike,
  BIKE_CATEGORIES,
  BIKE_CONDITION_LABELS,
  BIKE_SOURCES,
  BikeCategory,
  BikeCondition,
  BikeSource,
} from "@/types/bike";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { formatPriceVND } from "@/lib/utils";

interface EditBikeDialogProps {
  bike: Bike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBikeDialog({ bike, open, onOpenChange }: EditBikeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin xe. Thay đổi sẽ áp dụng ngay trên toàn bộ
            website.
          </DialogDescription>
        </DialogHeader>

        {bike && (
          <EditBikeForm
            key={bike.id}
            bike={bike}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditBikeForm({ bike, onDone }: { bike: Bike; onDone: () => void }) {
  const { updateBike } = useBikes();
  const [name, setName] = useState(bike.name);
  const [brand, setBrand] = useState(bike.brand);
  const [productType, setProductType] = useState(bike.productType);
  const [category, setCategory] = useState<BikeCategory>(bike.category);
  const [source, setSource] = useState<BikeSource>(bike.source);
  const [condition, setCondition] = useState<BikeCondition>(bike.condition);
  const [originalPrice, setOriginalPrice] = useState(String(bike.originalPrice));
  const [price, setPrice] = useState(String(bike.price));
  const [stock, setStock] = useState(String(bike.stock));
  const [location, setLocation] = useState(bike.location);
  const [description, setDescription] = useState(bike.description);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const originalPriceNum = Number(originalPrice) || 0;
  const priceNum = Number(price) || 0;
  const discountPercent =
    originalPriceNum > priceNum && originalPriceNum > 0
      ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
      : 0;

  const handleSave = () => {
    setError("");

    if (!name.trim()) {
      setError("Tên xe không được để trống.");
      return;
    }
    if (priceNum <= 0) {
      setError("Giá bán phải lớn hơn 0.");
      return;
    }
    if (originalPriceNum < priceNum) {
      setError("Giá niêm yết không được thấp hơn giá bán.");
      return;
    }

    setIsSaving(true);
    const success = updateBike(bike.id, {
      name: name.trim(),
      brand: brand.trim(),
      productType: productType.trim(),
      category,
      source,
      condition,
      originalPrice: originalPriceNum,
      price: priceNum,
      discountPercent,
      stock: Math.max(0, Math.floor(Number(stock) || 0)),
      location: location.trim(),
      description: description.trim(),
    });
    setIsSaving(false);

    if (!success) {
      setError("Không thể lưu thay đổi, vui lòng thử lại.");
      return;
    }

    onDone();
  };

  return (
    <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="edit-name">Tên Xe</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-brand">Thương Hiệu</Label>
          <Input
            id="edit-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-product-type">Loại Xe</Label>
          <Input
            id="edit-product-type"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-category">Danh Mục</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as BikeCategory)}
          >
            <SelectTrigger id="edit-category">
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-source">Nguồn Hàng</Label>
          <Select
            value={source}
            onValueChange={(value) => setSource(value as BikeSource)}
          >
            <SelectTrigger id="edit-source">
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
        <Label htmlFor="edit-condition">Tình Trạng</Label>
        <Select
          value={condition}
          onValueChange={(value) => setCondition(value as BikeCondition)}
        >
          <SelectTrigger id="edit-condition">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(BIKE_CONDITION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-original-price">Giá Niêm Yết (VNĐ)</Label>
          <Input
            id="edit-original-price"
            type="number"
            min={0}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {formatPriceVND(originalPriceNum)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-price">Giá Sau Giảm (VNĐ)</Label>
          <Input
            id="edit-price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {formatPriceVND(priceNum)}
            {discountPercent > 0 && (
              <span className="ml-1 font-semibold text-red-600">
                -{discountPercent}%
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-stock">Tồn Kho</Label>
          <Input
            id="edit-stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-location">Địa Chỉ / Kho Xe</Label>
          <Input
            id="edit-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="edit-description">Mô Tả Sản Phẩm</Label>
        <Textarea
          id="edit-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
      </Button>
    </div>
  );
}
