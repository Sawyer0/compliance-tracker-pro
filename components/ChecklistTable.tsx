"use client";

import { useChecklistStore } from "@/store/checklistStore";
import ChecklistItem from "./ChecklistItem";

export default function ChecklistTable() {
  const { items, filterStatus } = useChecklistStore();

  const filteredItems = items.filter((item) => {
    if (filterStatus === "completed") return item.completed;
    if (filterStatus === "pending") return !item.completed;
    return true;
  });

  if (filteredItems.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No checklist items match your current filter.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {filteredItems.map((item) => (
        <ChecklistItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
