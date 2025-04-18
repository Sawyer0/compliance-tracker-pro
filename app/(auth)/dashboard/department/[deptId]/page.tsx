"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useChecklistStore,
  useChecklistFilterStatus,
} from "@/store/checklistStore";
import { ChecklistTable } from "@/components/compliance";
import { useChecklists } from "@/lib/hooks/useChecklists";
import { ChecklistItem } from "@/types/checklist";

export default function DepartmentChecklistPage() {
  const router = useRouter();
  const { deptId } = useParams();

  // Use selectors instead of accessing the full store state
  const filterStatus = useChecklistFilterStatus();
  const setFilterStatus = useChecklistStore((state) => state.setFilterStatus);

  const [completionRate, setCompletionRate] = useState(0);

  const { checklists, isLoading, isError, error, updateChecklist } =
    useChecklists(deptId as string);

  // Only set items when they actually change
  useEffect(() => {
    if (checklists && checklists.length > 0) {
      // Use getState to access the store outside of renders
      const setItems = useChecklistStore.getState().setItems;
      setItems(checklists);
    }
  }, [checklists]);

  // Memoize the completion rate calculation
  useEffect(() => {
    if (!checklists || checklists.length === 0) {
      setCompletionRate(0);
      return;
    }

    const completedCount = checklists.filter(
      (item: ChecklistItem) => item.completed
    ).length;
    const newCompletionRate = Math.round(
      (completedCount / checklists.length) * 100
    );

    setCompletionRate(newCompletionRate);
  }, [checklists]);

  if (isLoading) {
    return <p className="loading-text">Loading checklist…</p>;
  }

  if (isError) {
    return (
      <p className="error-text">
        Error connecting to database: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="page-wrapper">
      <button onClick={() => router.push("/dashboard")} className="back-link">
        ← Back to Departments
      </button>

      <h1 className="text-2xl font-semibold">Department Checklist</h1>

      <div className="progress-bg">
        <div
          className="progress-fill"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      <div className="text-sm text-gray-600">{completionRate}% completed</div>

      <div className="flex justify-end">
        <select
          value={filterStatus}
          onChange={(e) => {
            const value = e.target.value as "all" | "completed" | "pending";
            setFilterStatus(value);
          }}
          className="dropdown"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {checklists.length === 0 ? (
        <p className="loading-text">
          No checklist items found for this department.
        </p>
      ) : (
        <ChecklistTable />
      )}
    </div>
  );
}
