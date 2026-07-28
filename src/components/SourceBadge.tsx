import { PackageOpen, Warehouse, Store } from "lucide-react";

import { BIKE_SOURCES, BikeSource } from "@/types/bike";
import { cn } from "@/lib/utils";

const SOURCE_STYLES: Record<BikeSource, string> = {
  "thanh-ly": "bg-red-100 text-red-700 border-red-200",
  "xa-kho": "bg-orange-100 text-orange-700 border-orange-200",
  "trung-bay": "bg-blue-100 text-blue-700 border-blue-200",
};

const SOURCE_ICONS: Record<BikeSource, React.ElementType> = {
  "thanh-ly": PackageOpen,
  "xa-kho": Warehouse,
  "trung-bay": Store,
};

interface SourceBadgeProps {
  source: BikeSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const info = BIKE_SOURCES[source];
  const Icon = SOURCE_ICONS[source];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        SOURCE_STYLES[source],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {info.label}
    </span>
  );
}
