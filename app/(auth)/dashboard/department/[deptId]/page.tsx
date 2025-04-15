"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChecklistStore } from "@/store/checklistStore";
import { ChecklistTable } from "@/components/compliance";
import { useChecklists } from "@/lib/hooks/useChecklists";
import { ChecklistItem } from "@/types/checklist";

export default function DepartmentChecklistPage() {
  const router = useRouter();
  const { deptId } = useParams();
  const { setFilterStatus, filterStatus } = useChecklistStore();
  const [completionRate, setCompletionRate] = useState(0);

  const { checklists, isLoading, isError, error, updateChecklist } =
    useChecklists(deptId as string);

  useEffect(() => {
    if (checklists) {
      useChecklistStore.getState().setItems(checklists);
    }
  }, [checklists]);

  useEffect(() => {
    setCompletionRate(
      checklists.length > 0
        ? Math.round(
            (checklists.filter((i: ChecklistItem) => i.completed).length /
              checklists.length) *
              100
          )
        : 0
    );
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
