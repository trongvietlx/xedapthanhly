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
  addBike: (bike: Bike) => void;
  updateBike: (bikeId: string, updates: Partial<Bike>) => void;
  toggleBikeActive: (bikeId: string) => void;
  deleteBike: (bikeId: string) => void;
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

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bikes));
    } catch (error) {
      console.error("Failed to persist bikes to localStorage:", error);
    }
  }, [bikes, isHydrated]);

  const addBike = (bike: Bike) => {
    setBikes((prev) => [bike, ...prev]);
  };

  const updateBike = (bikeId: string, updates: Partial<Bike>) => {
    setBikes((prev) =>
      prev.map((bike) => (bike.id === bikeId ? { ...bike, ...updates } : bike))
    );
  };

  const toggleBikeActive = (bikeId: string) => {
    setBikes((prev) =>
      prev.map((bike) =>
        bike.id === bikeId ? { ...bike, isActive: !bike.isActive } : bike
      )
    );
  };

  const deleteBike = (bikeId: string) => {
    setBikes((prev) => prev.filter((bike) => bike.id !== bikeId));
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
