import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ChecklistItem } from "@/types/checklist";

type ChecklistState = {
  items: ChecklistItem[];
  isLoading: boolean;
  filterStatus: "all" | "completed" | "pending";
  lastUpdated: number; // Add timestamp for GC
};

type ChecklistActions = {
  setItems: (items: ChecklistItem[]) => void;
  setLoading: (loading: boolean) => void;
  setFilterStatus: (status: "all" | "completed" | "pending") => void;
  updateItem: (updatedItem: ChecklistItem) => void;
  addItem: (item: ChecklistItem) => void;
  removeItem: (id: string) => void;
  clearStaleItems: () => void; // Add GC function
};

type ChecklistStore = ChecklistState & ChecklistActions;

// Create the store with a memoized selector pattern and persistence
export const useChecklistStore = create<ChecklistStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isLoading: false,
        filterStatus: "all",
        lastUpdated: Date.now(),

        // Compare previous items with new items to prevent unnecessary updates
        setItems: (items) =>
          set((state) => {
            // Deep comparison to avoid unnecessary updates
            if (JSON.stringify(state.items) === JSON.stringify(items)) {
              return {}; // Return empty object to avoid state update
            }
            return { items, lastUpdated: Date.now() };
          }),

        updateItem: (updatedItem: ChecklistItem) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            ),
            lastUpdated: Date.now(),
          })),

        setLoading: (isLoading) => set({ isLoading }),

        setFilterStatus: (status) => set({ filterStatus: status }),

        addItem: (item: ChecklistItem) =>
          set((state) => ({
            items: [...state.items, item],
            lastUpdated: Date.now(),
          })),

        removeItem: (id: string) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            lastUpdated: Date.now(),
          })),

        // Remove items that haven't been updated in 24 hours
        clearStaleItems: () => {
          const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

          set((state) => {
            // Keep only items that were created recently
            const freshItems = state.items.filter(
              (item) => new Date(item.created_at || 0).getTime() > cutoffTime
            );

            // Only update if we actually removed anything
            if (freshItems.length < state.items.length) {
              return { items: freshItems, lastUpdated: Date.now() };
            }

            return {}; // Return empty object if nothing changed
          });
        },
      }),
      {
        name: "checklist-storage",
        partialize: (state) => ({
          items: state.items,
          filterStatus: state.filterStatus,
        }),
      }
    )
  )
);

// Selector hooks for better performance
export const useChecklistItems = () =>
  useChecklistStore((state) => state.items);
export const useChecklistLoading = () =>
  useChecklistStore((state) => state.isLoading);
export const useChecklistFilterStatus = () =>
  useChecklistStore((state) => state.filterStatus);
export const useFilteredChecklistItems = () => {
  const items = useChecklistStore((state) => state.items);
  const filterStatus = useChecklistStore((state) => state.filterStatus);

  return items.filter((item) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "completed") return item.completed;
    return !item.completed;
  });
};
