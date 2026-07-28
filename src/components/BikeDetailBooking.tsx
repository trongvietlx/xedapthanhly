"use client";

import { useState } from "react";

import { Bike } from "@/types/bike";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/BookingModal";

export function BikeDetailBooking({ bike }: { bike: Bike }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        Giữ Xe Ngay - Chỉ Cần Tên &amp; SĐT
      </Button>
      <BookingModal bike={bike} open={open} onOpenChange={setOpen} />
    </>
  );
}
