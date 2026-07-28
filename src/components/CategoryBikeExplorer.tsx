"use client";

import { useMemo, useState } from "react";

import { Bike, BIKE_CATEGORIES, BIKE_CATEGORY_ORDER, BikeCategory } from "@/types/bike";
import { BikeCard } from "@/components/BikeCard";
import { cn } from "@/lib/utils";

interface CategoryBikeExplorerProps {
  bikes: Bike[];
}

type TabValue = BikeCategory | "all";

const TABS: { label: string; value: TabValue }[] = [
  { label: "Tất Cả", value: "all" },
  ...BIKE_CATEGORY_ORDER.map((category) => ({
    label: BIKE_CATEGORIES[category].label,
    value: category as TabValue,
  })),
];

export function CategoryBikeExplorer({ bikes }: CategoryBikeExplorerProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const filteredBikes = useMemo(() => {
    if (activeTab === "all") return bikes;
    return bikes.filter((bike) => bike.category === activeTab);
  }, [bikes, activeTab]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredBikes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Hiện chưa có xe nào trong danh mục này.
        </p>
      )}
    </div>
  );
}
