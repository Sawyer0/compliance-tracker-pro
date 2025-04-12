import { create } from "zustand";
import { ChecklistItem } from "@/types/checklist";

type ChecklistStore = {
  items: ChecklistItem[];
  isLoading: boolean;
  filterStatus: "all" | "completed" | "pending";
  setItems: (items: ChecklistItem[]) => void;
  setLoading: (loading: boolean) => void;
  setFilterStatus: (status: "all" | "completed" | "pending") => void;
  updateItem: (updatedItem: ChecklistItem) => void;
};

export const useChecklistStore = create<ChecklistStore>((set) => ({
  items: [],
  isLoading: false,
  filterStatus: "all",

  setItems: (items) => set({ items }),
  updateItem: (updatedItem: ChecklistItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setFilterStatus: (status) => set({ filterStatus: status }),
}));
