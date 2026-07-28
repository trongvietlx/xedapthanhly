"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Bike } from "@/types/bike";
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
import { formatPriceVND } from "@/lib/utils";

interface BookingModalProps {
  bike: Bike;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function BookingModal({ bike, open, onOpenChange }: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const resetAndClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setName("");
        setPhone("");
        setAddress("");
        setState("idle");
        setErrorMessage("");
      }, 200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          bikeId: bike.id,
          bikeName: bike.name,
          bikePrice: bike.price,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setState("success");
    } catch (err) {
      setState("error");
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        {state === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center animate-in fade-in">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
            <DialogTitle>🎉 Đặt Giữ Xe Thành Công!</DialogTitle>
            <DialogDescription>
              Cảm ơn <strong>{name}</strong>, chúng tôi đã giữ xe{" "}
              <strong>{bike.name}</strong> cho bạn. Shop bên em sẽ chủ động
              liên hệ với anh/chị qua Điện thoại hoặc Zalo để xác nhận đơn
              hàng sớm nhất. Anh/chị chú ý điện thoại giúp shop nhé!
            </DialogDescription>
            <Button className="mt-2 w-full" onClick={() => resetAndClose(false)}>
              Đóng
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Giữ Xe - Không Cần Thanh Toán Trước</DialogTitle>
              <DialogDescription>
                Chỉ cần nhập Tên và Số Điện Thoại, nhân viên sẽ liên hệ xác
                nhận đơn hàng ngay lập tức.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium">{bike.name}</p>
              <p className="font-bold text-primary">
                {formatPriceVND(bike.price)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Họ và Tên</Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  pattern="[0-9]{9,11}"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Địa Chỉ Giao Hàng / Tỉnh Thành</Label>
                <Input
                  id="address"
                  placeholder="VD: Quận 7, TP.HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {state === "error" && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              <Button type="submit" size="lg" disabled={state === "submitting"}>
                {state === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác Nhận Giữ Xe"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Không mất phí đặt cọc - Shop bên em sẽ chủ động liên hệ với
                anh chị qua điện thoại hoặc tin nhắn Zalo để xác nhận, anh
                chị để ý điện thoại giúp bên em nhé!
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
