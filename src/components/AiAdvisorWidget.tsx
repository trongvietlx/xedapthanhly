"use client";

import { useState } from "react";
import { Ruler, Target, Wallet } from "lucide-react";

import { Bike } from "@/types/bike";
import { BikeCard } from "@/components/BikeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceVND } from "@/lib/utils";

interface AiAdvisorWidgetProps {
  bikes: Bike[];
}

interface MatchResult {
  bikes: Bike[];
  note: string;
}

function findMatches(bikes: Bike[], height: number, budget: number): MatchResult {
  const heightMatches = bikes.filter(
    (bike) => height >= bike.heightMin && height <= bike.heightMax
  );

  const exactMatches = heightMatches
    .filter((bike) => bike.price <= budget)
    .sort((a, b) => b.price - a.price);

  if (exactMatches.length > 0) {
    return {
      bikes: exactMatches.slice(0, 2),
      note: "Đây là những chiếc xe phù hợp nhất với chiều cao và ngân sách của bạn:",
    };
  }

  if (heightMatches.length > 0) {
    const cheapestInRange = [...heightMatches].sort((a, b) => a.price - b.price);
    return {
      bikes: cheapestInRange.slice(0, 2),
      note: `Chưa có xe nào vừa đúng ngân sách ${formatPriceVND(
        budget
      )}, đây là các lựa chọn phù hợp chiều cao gần nhất:`,
    };
  }

  const closestByHeight = bikes
    .filter((bike) => bike.price <= budget)
    .sort((a, b) => {
      const midA = (a.heightMin + a.heightMax) / 2;
      const midB = (b.heightMin + b.heightMax) / 2;
      return Math.abs(midA - height) - Math.abs(midB - height);
    });

  if (closestByHeight.length > 0) {
    return {
      bikes: closestByHeight.slice(0, 2),
      note: "Chưa có xe khớp chính xác chiều cao, đây là gợi ý gần nhất trong ngân sách của bạn:",
    };
  }

  return {
    bikes: [],
    note: "Hiện chưa có xe phù hợp với tiêu chí này, vui lòng gọi hotline 0900.000.000 để được tư vấn thêm.",
  };
}

export function AiAdvisorWidget({ bikes }: AiAdvisorWidgetProps) {
  const [height, setHeight] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heightNum = Number(height);
    const budgetNum = Number(budget);
    if (!heightNum || !budgetNum) return;
    setResult(findMatches(bikes, heightNum, budgetNum));
  };

  return (
    <section className="container">
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">
              🎯 Chọn Xe Nhanh Theo Yêu Cầu Của Bạn
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Nhập chiều cao và ngân sách, hệ thống sẽ gợi ý ngay chiếc xe phù
            hợp nhất trong kho.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="advisor-height">Chiều cao của bạn (cm)</Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="advisor-height"
                  type="number"
                  min={80}
                  max={220}
                  placeholder="VD: 165"
                  className="pl-9"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="advisor-budget">Ngân sách tối đa (VNĐ)</Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="advisor-budget"
                  type="number"
                  min={0}
                  step={100000}
                  placeholder="VD: 5000000"
                  className="pl-9"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full">
              🔍 Tìm Xe Phù Hợp
            </Button>
          </form>

          {result && (
            <div className="mt-2 flex flex-col gap-4 border-t pt-4">
              <p className="text-sm font-medium">{result.note}</p>
              {result.bikes.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {result.bikes.map((bike) => (
                    <BikeCard key={bike.id} bike={bike} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
