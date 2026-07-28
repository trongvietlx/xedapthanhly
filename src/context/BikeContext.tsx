"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { Bike } from "@/types/bike";
import { mockBikes } from "@/data/mockBikes";

const STORAGE_KEY = "xe-dap-thanh-ly:bikes";

interface BikeContextValue {
  bikes: Bike[];
  /** false cho tới khi đã đọc xong localStorage ở lần mount đầu tiên trên client. */
  isHydrated: boolean;
  /** false nếu lưu localStorage thất bại (VD: vượt quota) - state trong bộ nhớ sẽ được hoàn tác. */
  addBike: (bike: Bike) => boolean;
  updateBike: (bikeId: string, updates: Partial<Bike>) => boolean;
  toggleBikeActive: (bikeId: string) => boolean;
  deleteBike: (bikeId: string) => boolean;
}

const BikeContext = createContext<BikeContextValue | null>(null);

function loadBikesFromStorage(): Bike[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed as Bike[];
  } catch (error) {
    console.error("Failed to read bikes from localStorage:", error);
    return null;
  }
}

/**
 * Ghi đồng bộ ngay khi có thay đổi (thay vì qua useEffect chạy sau render)
 * để phát hiện lỗi (VD: QuotaExceededError khi ảnh base64 quá lớn) NGAY
 * tại nơi gọi, thay vì để lỗi bị nuốt âm thầm và mất dữ liệu sau khi F5.
 */
function persist(bikes: Bike[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bikes));
    return true;
  } catch (error) {
    console.error("Failed to persist bikes to localStorage:", error);
    return false;
  }
}

export function BikeProvider({ children }: { children: ReactNode }) {
  const [bikes, setBikes] = useState<Bike[]>(mockBikes);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = loadBikesFromStorage();
    if (stored) {
      setBikes(stored);
    }
    setIsHydrated(true);
  }, []);

  const addBike = (bike: Bike): boolean => {
    const next = [bike, ...bikes];
    const success = persist(next);
    if (success) {
      setBikes(next);
    }
    return success;
  };

  const updateBike = (bikeId: string, updates: Partial<Bike>): boolean => {
    const next = bikes.map((bike) =>
      bike.id === bikeId ? { ...bike, ...updates } : bike
    );
    const success = persist(next);
    if (success) {
      setBikes(next);
    }
    return success;
  };

  const toggleBikeActive = (bikeId: string): boolean => {
    const next = bikes.map((bike) =>
      bike.id === bikeId ? { ...bike, isActive: !bike.isActive } : bike
    );
    const success = persist(next);
    if (success) {
      setBikes(next);
    }
    return success;
  };

  const deleteBike = (bikeId: string): boolean => {
    const next = bikes.filter((bike) => bike.id !== bikeId);
    const success = persist(next);
    if (success) {
      setBikes(next);
    }
    return success;
  };

  return (
    <BikeContext.Provider
      value={{
        bikes,
        isHydrated,
        addBike,
        updateBike,
        toggleBikeActive,
        deleteBike,
      }}
    >
      {children}
    </BikeContext.Provider>
  );
}

export function useBikes(): BikeContextValue {
  const context = useContext(BikeContext);
  if (!context) {
    throw new Error("useBikes must be used within a BikeProvider");
  }
  return context;
}
